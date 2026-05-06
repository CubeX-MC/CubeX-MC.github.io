import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// ---- Firebase init ----

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// ---- config ----

const AI_POST_COOLDOWN_MS = 90 * 60 * 1000; // 90 minutes between AI spontaneous posts
const MAX_RECENT_MESSAGES = 30;

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

async function fetchFreeModels() {
  const res = await fetch('https://openrouter.ai/api/v1/models');
  if (!res.ok) return null;
  const data = await res.json();
  const free = (data.data || []).filter(
    m => parseFloat(m.pricing?.prompt || '0') === 0 &&
         parseFloat(m.pricing?.completion || '0') === 0
  );
  console.log(`Found ${free.length} free models`);
  return free;
}

function shuffleModels(freeModels) {
  if (!freeModels?.length) return ['google/gemini-2.5-flash-lite'];
  const preferred = [];
  const rest = [];
  for (const m of freeModels) {
    const id = m.id || '';
    if (id.includes('gemini') || id.includes('llama') || id.includes('deepseek')) {
      preferred.push(id);
    } else {
      rest.push(id);
    }
  }
  // Shuffle each group, preferred first
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callOpenRouter(messages, apiKey) {
  const freeModels = await fetchFreeModels();
  const models = shuffleModels(freeModels);

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    console.log(`Trying model ${i + 1}/${models.length}: ${model}`);

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://cubexmc.org',
        'X-Title': 'CubeX Community AI Chat',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.9,
        max_tokens: 256,
        top_p: 0.95,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      if (content) return content;
      console.warn(`  Empty response, trying next...`);
      continue;
    }

    if (res.status === 429) {
      console.warn(`  Rate limited, trying next model...`);
      await sleep(2000); // Brief pause before retry
      continue;
    }

    // Non-retryable error
    const text = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${text.slice(0, 300)}`);
  }

  throw new Error(`All ${models.length} free models exhausted`);
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
  // Fetch recent messages and find the last AI one in JS to avoid composite index requirement
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

  // Fetch recent messages and check in JS to avoid composite index
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
  console.log(`AI message saved: ${content.slice(0, 80)}...`);
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
    console.log(`No need for AI post. Next eligible after: ${nextPost.toISOString()}`);
    return;
  }

  // Build context
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
  if (!hasRecentUser) {
    context.push({
      role: 'user',
      content: '（社区里现在没人说话，你可以主动发起一个话题聊聊。聊 Minecraft 相关的内容。）',
    });
  }

  // Call AI
  try {
    const content = await callOpenRouter(context, apiKey);
    if (content && content.length > 0 && content.length <= 500) {
      await saveAiMessage(content);
      console.log('Done.');
    } else {
      console.log('AI returned empty or too long response.');
    }
  } catch (err) {
    console.error('OpenRouter call failed:', err.message);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
