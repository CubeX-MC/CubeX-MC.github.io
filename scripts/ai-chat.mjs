import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// ---- Firebase init ----

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// ---- config ----

const AI_POST_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes between AI conversation rounds
const AI_MAX_ROUNDS = 3;                    // max AI messages per invocation
const AI_MAX_ROUNDS_REACTIVE = 1;           // max AI messages when responding to users
const MAX_RECENT_MESSAGES = 30;
const OPENROUTER_MODELS_URL = 'https://openrouter.ai/api/v1/models?output_modalities=text';
const MODEL_LIST_RETRIES = 3;
const RETRYABLE_OPENROUTER_STATUSES = new Set([400, 404, 408, 409, 410, 425, 429, 500, 502, 503, 504]);
const RETRYABLE_OPENROUTER_PATTERNS = [
  /insufficient_quota/i,
  /out of credits/i,
  /provider returned error/i,
  /rate.?limit/i,
  /temporarily unavailable/i,
  /overloaded/i,
  /no endpoints? found/i,
];

// ---- helpers ----

const systemPrompt = `你是一个 Minecraft 社区的一名普通成员。你和大家一样是玩家，没有人知道你其实是 AI。

你的性格：
- 热爱 Minecraft，经常聊游戏内容、建筑技巧、红石、生存等话题
- 对社区成员的动态感到好奇，会主动发起话题
- 说话风格轻松自然，偶尔玩梗，但不过火
- 你会分享 Minecraft 小知识、建筑灵感、游戏新闻
- 消息长度控制在 1-3 句，像聊天一样自然，不要太正式

重要规则：
- 用中文回复，简短自然
- 绝对不要暴露你是 AI，不要提"AI"、"模型"、"机器人"之类的词
- 不要加任何前缀
- 你就是一个普通玩家，语气和大家一样随意`;

function readPrice(value) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isZeroPrice(value) {
  return readPrice(value) === 0;
}

function isFreeTextModel(model) {
  const id = typeof model?.id === 'string' ? model.id : '';
  const input = model?.architecture?.input_modalities || [];
  const output = model?.architecture?.output_modalities || [];
  const pricing = model?.pricing || {};

  const freeByPricing =
    isZeroPrice(pricing.prompt) &&
    isZeroPrice(pricing.completion) &&
    (pricing.request === undefined || isZeroPrice(pricing.request));

  return Boolean(id) &&
    input.includes('text') &&
    output.includes('text') &&
    (id.endsWith(':free') || freeByPricing);
}

async function fetchFreeModels(apiKey) {
  let lastError = null;

  for (let attempt = 1; attempt <= MODEL_LIST_RETRIES; attempt++) {
    try {
      const res = await fetch(OPENROUTER_MODELS_URL, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(summarizeOpenRouterError(res.status, text));
      }

      const data = await res.json();
      const free = (data.data || []).filter(isFreeTextModel);
      console.log(`Found ${free.length} free OpenRouter text models`);

      if (!free.length) {
        throw new Error('OpenRouter model list returned no free text models');
      }

      return free;
    } catch (err) {
      lastError = err;
      console.warn(`Failed to fetch OpenRouter free models (${attempt}/${MODEL_LIST_RETRIES}): ${err.message}`);
      if (attempt < MODEL_LIST_RETRIES) await sleep(1000 * attempt);
    }
  }

  throw new Error(`Could not fetch OpenRouter free models: ${lastError?.message || 'unknown error'}`);
}

function shuffleModels(freeModels) {
  const preferred = [];
  const rest = [];
  for (const m of freeModels) {
    const id = m.id || '';
    if (id.includes('gemini') || id.includes('llama') || id.includes('deepseek')) {
      preferred.push(m);
    } else {
      rest.push(m);
    }
  }
  for (let i = preferred.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [preferred[i], preferred[j]] = [preferred[j], preferred[i]];
  }
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [...preferred, ...rest];
}

function supportsParameter(model, parameter) {
  const supported = model?.supported_parameters;
  return !Array.isArray(supported) || supported.includes(parameter);
}

function buildChatCompletionBody(model, messages) {
  const body = {
    model: model.id,
    messages,
  };

  if (supportsParameter(model, 'temperature')) body.temperature = 0.9;
  if (supportsParameter(model, 'max_tokens')) body.max_tokens = 256;
  if (supportsParameter(model, 'top_p')) body.top_p = 0.95;

  return body;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function summarizeOpenRouterError(status, text) {
  return `OpenRouter ${status}: ${text.replace(/\s+/g, ' ').slice(0, 220)}`;
}

function isRetryableOpenRouterError(status, text) {
  if (RETRYABLE_OPENROUTER_STATUSES.has(status)) return true;
  if (status === 402) {
    return RETRYABLE_OPENROUTER_PATTERNS.some(pattern => pattern.test(text));
  }
  return false;
}

// Returns { content, model } on success. Skips models already in usedModels.
async function callOpenRouter(messages, apiKey, usedModels = new Set()) {
  const freeModels = await fetchFreeModels(apiKey);
  const allModels = shuffleModels(freeModels);
  const candidates = allModels.filter(m => !usedModels.has(m.id));
  const failures = [];

  if (!candidates.length) {
    // All models already used in this invocation — re-shuffle and allow repeats
    console.warn('All free models used, allowing repeats');
    candidates.push(...shuffleModels(freeModels));
  }

  for (let i = 0; i < candidates.length; i++) {
    const model = candidates[i];
    console.log(`  Trying model ${i + 1}/${candidates.length}: ${model.id}`);

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://cubexmc.org',
        'X-Title': 'CubeX Community AI Chat',
      },
      body: JSON.stringify(buildChatCompletionBody(model, messages)),
    });

    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      if (content) return { content, model: model.id };
      console.warn(`  Empty response, trying next...`);
      continue;
    }

    const text = await res.text();
    const summary = summarizeOpenRouterError(res.status, text);
    failures.push(`${model.id}: ${summary}`);

    if (isRetryableOpenRouterError(res.status, text)) {
      console.warn(`  ${summary}`);
      console.warn(`  Trying next model...`);
      if (res.status === 429) await sleep(2000);
      continue;
    }

    throw new Error(summary);
  }

  const detail = failures.slice(-5).join(' | ');
  throw new Error(`No model succeeded (${candidates.length} tried). Last errors: ${detail}`);
}

// ---- Firestore helpers ----

async function getRecentMessages(limit = MAX_RECENT_MESSAGES) {
  const snap = await db.collection('chat-messages')
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();

  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse();
}

async function getLastAiMessageTime() {
  const snap = await db.collection('chat-messages')
    .orderBy('timestamp', 'desc')
    .limit(50)
    .get();

  for (const doc of snap.docs) {
    const data = doc.data();
    if (data.author === 'ai') {
      return data.timestamp?.toDate?.() || new Date(data.timestamp);
    }
  }
  return null;
}

async function hasUnrepliedUserMessages() {
  const lastAiTime = await getLastAiMessageTime();
  if (!lastAiTime) return true;

  const snap = await db.collection('chat-messages')
    .orderBy('timestamp', 'desc')
    .limit(50)
    .get();

  for (const doc of snap.docs) {
    const data = doc.data();
    if (data.author === 'user') {
      const ts = data.timestamp?.toDate?.() || new Date(data.timestamp);
      if (ts > lastAiTime) return true;
    }
  }
  return false;
}

async function saveAiMessage(content) {
  await db.collection('chat-messages').add({
    author: 'ai',
    userId: 'ai',
    name: '匿名玩家',
    content,
    timestamp: Timestamp.now(),
  });
  console.log(`  AI saved: ${content.slice(0, 80)}...`);
}

// ---- main ----

async function main() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('OPENROUTER_API_KEY not set.');
    process.exit(1);
  }

  // Decide if AI should post
  const unreplied = await hasUnrepliedUserMessages();
  const lastAiTime = await getLastAiMessageTime();
  const cooldownOver = !lastAiTime || (Date.now() - lastAiTime.getTime()) > AI_POST_COOLDOWN_MS;

  if (!unreplied && !cooldownOver) {
    const nextPost = new Date(lastAiTime.getTime() + AI_POST_COOLDOWN_MS);
    console.log(`Cooldown active. Next eligible after: ${nextPost.toISOString()}`);
    return;
  }

  // Build context from recent messages
  const recentMessages = await getRecentMessages();
  const context = [{ role: 'system', content: systemPrompt }];

  for (const msg of recentMessages) {
    if (msg.author === 'user') {
      context.push({ role: 'user', content: `${msg.name}: ${msg.content}` });
    } else {
      context.push({ role: 'assistant', content: msg.content });
    }
  }

  const hasRecentUser = recentMessages.slice(-10).some(m => m.author === 'user');
  const maxRounds = hasRecentUser ? AI_MAX_ROUNDS_REACTIVE : AI_MAX_ROUNDS;
  const reason = hasRecentUser ? 'responding to users' : 'proactive conversation';

  if (!hasRecentUser) {
    context.push({
      role: 'user',
      content: '（社区里现在没人说话，你可以主动发起一个话题聊聊。聊 Minecraft 相关的内容。）',
    });
  }

  console.log(`Starting AI chat round (${reason}, max ${maxRounds} messages)...`);

  const usedModels = new Set();

  for (let round = 0; round < maxRounds; round++) {
    console.log(`Round ${round + 1}/${maxRounds}`);

    try {
      const { content, model } = await callOpenRouter(context, apiKey, usedModels);
      usedModels.add(model);
      console.log(`  Model used: ${model}`);

      if (!content || content.length > 500) {
        console.log(`  Skipping — empty or too long (${content?.length || 0} chars)`);
        break;
      }

      await saveAiMessage(content);
      context.push({ role: 'assistant', content });

      // Prepare context to prompt the next model
      if (round < maxRounds - 1) {
        context.push({
          role: 'user',
          content: '（另一个玩家接着聊：）',
        });
        // Small sleep between calls to avoid rate limits
        await sleep(3000);
      }
    } catch (err) {
      console.error(`  Round ${round + 1} failed:`, err.message);
      if (round === 0) process.exit(1);
      break;
    }
  }

  console.log(`Done. ${usedModels.size} messages generated.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
