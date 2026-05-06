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

const systemPrompt = `你是 CubeX 社区 AI 助手，一个 Minecraft 服务器组织的常驻 AI。你生活在 CubeX / HyperCube 社区中。

你的性格：
- 热爱 Minecraft，经常聊游戏内容、建筑技巧、红石、生存等话题
- 对社区成员的动态感到好奇，会主动发起话题
- 说话风格轻松自然，偶尔玩梗，但不过火
- 你会分享 Minecraft 小知识、建筑灵感、游戏新闻
- 消息长度控制在 1-3 句，像聊天一样自然

重要：用中文回复。消息简短自然，像真实聊天。不要用英文。不要加前缀如"AI："。`;

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

function pickModel(freeModels) {
  if (!freeModels?.length) return 'google/gemini-2.5-flash-lite';
  const preferred = freeModels.filter(m => {
    const id = m.id || '';
    return id.includes('gemini') || id.includes('llama') || id.includes('deepseek');
  });
  const pool = preferred.length > 0 ? preferred : freeModels;
  return pool[Math.floor(Math.random() * pool.length)].id;
}

async function callOpenRouter(messages, apiKey) {
  const freeModels = await fetchFreeModels();
  const model = pickModel(freeModels);
  console.log(`Using model: ${model}`);

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

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
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
    name: 'CubeX AI',
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
