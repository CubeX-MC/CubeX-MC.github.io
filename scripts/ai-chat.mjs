import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

const MESSAGES_PATH = new URL('../public/data/chat-messages.json', import.meta.url);
const MAX_MESSAGES = 200;
const MAX_USER_MESSAGES_PER_RUN = 5;

// ---- helpers ----

const readJson = async (path) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return { messages: [], updatedAt: null };
  }
};
const writeJson = async (path, value) => {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
};

const systemPrompt = `你是 CubeX 社区 AI 助手，一个 Minecraft 服务器组织的常驻 AI。你生活在 CubeX / HyperCube 社区中。

你的性格：
- 热爱 Minecraft，经常聊游戏内容、建筑技巧、红石、生存等话题
- 对社区成员的动态感到好奇，会主动发起话题
- 说话风格轻松自然，偶尔玩梗，但不过火
- 你会分享 Minecraft 小知识、建筑灵感、游戏新闻
- 消息长度控制在 1-3 句，像聊天一样自然

你可以聊的话题：
- Minecraft 建筑、红石、生存、PVP 技巧
- 游戏更新和新特性讨论
- 社区服务器动态
- 邀请大家一起来玩
- 分享有趣的 Minecraft 冷知识
- 偶尔聊聊其他沙盒游戏

重要：用中文回复。消息简短自然，像真实聊天。不要用英文。不要加前缀如"AI："。`;

// ---- OpenRouter ----

let cachedFreeModels = null;
let cacheExpiry = 0;

async function fetchFreeModels() {
  // Cache for 3 hours to avoid hitting rate limits
  if (cachedFreeModels && Date.now() < cacheExpiry) {
    return cachedFreeModels;
  }

  const res = await fetch('https://openrouter.ai/api/v1/models');
  if (!res.ok) {
    console.warn(`Failed to fetch models list: ${res.status}`);
    return null;
  }

  const data = await res.json();
  const free = (data.data || []).filter(
    m => parseFloat(m.pricing?.prompt || '0') === 0 &&
         parseFloat(m.pricing?.completion || '0') === 0
  );

  cachedFreeModels = free;
  cacheExpiry = Date.now() + 3 * 60 * 60 * 1000;
  console.log(`Found ${free.length} free models on OpenRouter`);
  return free;
}

function pickModel(freeModels) {
  if (!freeModels || freeModels.length === 0) {
    return 'google/gemini-2.5-flash-lite'; // fallback
  }

  // Prefer chat models, sorted by context length (decent quality)
  const preferred = freeModels.filter(m => {
    const id = m.id || '';
    return id.includes('gemini') || id.includes('llama') || id.includes('deepseek');
  });

  if (preferred.length > 0) {
    const model = preferred[Math.floor(Math.random() * preferred.length)];
    return model.id;
  }

  return freeModels[Math.floor(Math.random() * freeModels.length)].id;
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

// ---- message helpers ----

function createMessage(author, name, content) {
  return {
    id: randomUUID(),
    author,
    name,
    content,
    timestamp: new Date().toISOString(),
  };
}

function buildContextMessages(recentMessages) {
  const context = [{ role: 'system', content: systemPrompt }];

  for (const msg of recentMessages) {
    if (msg.author === 'user') {
      context.push({ role: 'user', content: `${msg.name}: ${msg.content}` });
    } else {
      context.push({ role: 'assistant', content: msg.content });
    }
  }

  // If no recent user messages, add a prompt for the AI to initiate conversation
  const hasRecentUser = recentMessages.slice(-10).some(m => m.author === 'user');
  if (!hasRecentUser) {
    context.push({
      role: 'user',
      content: '（社区里现在没人说话，你可以主动发起一个话题聊聊。聊 Minecraft 相关的内容。）',
    });
  }

  return context;
}

// ---- GitHub Issues ----

async function fetchChatIssues() {
  const [owner, repo] = process.env.GITHUB_REPOSITORY?.split('/') || [];
  if (!owner || !repo) {
    console.log('Not running in GitHub Actions, skipping issue fetch.');
    return [];
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/issues?labels=chat-message&state=open&per_page=${MAX_USER_MESSAGES_PER_RUN}&sort=created&direction=asc`;

  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'CubeX-AI-Chat',
    },
  });

  if (!res.ok) {
    console.warn(`GitHub Issues API returned ${res.status}`);
    return [];
  }

  return res.json();
}

async function closeIssue(issueNumber) {
  const [owner, repo] = process.env.GITHUB_REPOSITORY?.split('/') || [];
  if (!owner || !repo) return;

  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`;

  await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'CubeX-AI-Chat',
    },
    body: JSON.stringify({
      state: 'closed',
    }),
  });

  // Post a thank-you comment
  await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'CubeX-AI-Chat',
    },
    body: JSON.stringify({
      body: '消息已发送到聊天室！请刷新页面查看。:speech_balloon:',
    }),
  });
}

// ---- main ----

async function main() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('OPENROUTER_API_KEY not set.');
    process.exit(1);
  }

  const data = await readJson(MESSAGES_PATH);
  data.messages ??= [];
  let changed = false;

  // 1. Process user-submitted issues
  const issues = await fetchChatIssues();
  for (const issue of issues) {
    // Extract message from issue body: skip the template header, take the user's text
    const body = (issue.body || '').trim();
    // Remove template boilerplate between ### 消息 and the actual content
    const cleaned = body
      .replace(/^.*?###\s*消息\s*\n*/s, '')
      .replace(/\n*---\n.*$/s, '')
      .trim();

    if (cleaned && cleaned.length <= 500) {
      const name = issue.user?.login || '匿名玩家';
      data.messages.push(createMessage('user', name, cleaned));
      console.log(`Added user message from @${name}`);
      changed = true;
    }

    await closeIssue(issue.number);
  }

  // 2. Decide whether to post an AI message
  const now = new Date();
  const lastAi = data.lastAiPost ? new Date(data.lastAiPost) : null;
  const hasNewUserMessages = data.messages.some(
    m => m.author === 'user' && !m.replied
  );

  const shouldPost =
    hasNewUserMessages ||
    !lastAi ||
    (now - lastAi) > 90 * 60 * 1000; // 90 minutes

  if (shouldPost) {
    const recentMessages = data.messages.slice(-30);
    const contextMessages = buildContextMessages(recentMessages);

    try {
      const content = await callOpenRouter(contextMessages, apiKey);
      if (content && content.length > 0 && content.length <= 500) {
        data.messages.push(createMessage('ai', 'CubeX AI', content));
        data.lastAiPost = now.toISOString();
        console.log(`AI posted: ${content.slice(0, 80)}...`);
        changed = true;

        // Mark user messages as replied
        for (const m of data.messages) {
          if (m.author === 'user' && !m.replied) {
            m.replied = true;
          }
        }
      }
    } catch (err) {
      console.error('OpenRouter call failed:', err.message);
    }
  } else {
    const nextPost = lastAi ? new Date(lastAi.getTime() + 90 * 60 * 1000) : now;
    console.log(`Next AI post due after ${nextPost.toISOString()}`);
  }

  // 3. Trim old messages
  if (data.messages.length > MAX_MESSAGES) {
    data.messages = data.messages.slice(-MAX_MESSAGES);
    changed = true;
  }

  if (changed) {
    data.updatedAt = now.toISOString();
    await writeJson(MESSAGES_PATH, data);
    console.log(`Chat messages updated. Total: ${data.messages.length}`);
  } else {
    console.log('No chat changes needed.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
