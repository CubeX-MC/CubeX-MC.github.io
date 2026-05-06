import { readFile, writeFile } from 'node:fs/promises';

export const targetsPath = new URL('../src/data/serverRecordTargets.json', import.meta.url);
export const recordsPath = new URL('../src/data/serverRecords.json', import.meta.url);
export const historyPath = new URL('../public/data/server-history.json', import.meta.url);

export const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
export const writeJson = async (path, value) => {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
};

export const writeCompactJson = async (path, value) => {
  await writeFile(path, `${JSON.stringify(value)}\n`);
};

export const endpointFor = (target) => {
  const address = encodeURIComponent(target.ip);
  if (target.edition === 'bedrock') {
    return `https://api.mcsrvstat.us/bedrock/3/${address}`;
  }
  return `https://api.mcsrvstat.us/3/${address}`;
};

export const mcmodEndpoint = 'https://play.mcmod.cn/frame/serverOnlineLog/';

export const normalizeDate = (date) => date.toISOString().slice(0, 10);

export const toShanghaiDate = (date) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(date);

export const isoFromShanghaiParts = (year, month, day, hour, minute) => {
  const utcMs = Date.UTC(year, month - 1, day, hour - 8, minute, 0, 0);
  return new Date(utcMs).toISOString();
};

export const parseMcmodSeries = (data, startDate) => {
  const times = Array.isArray(data?.time) ? data.time : [];
  const players = Array.isArray(data?.player) ? data.player : [];
  const points = [];

  let year = Number(startDate.slice(0, 4));
  let previousMonth = 0;
  let previousDay = 0;

  for (let i = 0; i < Math.min(times.length, players.length); i += 1) {
    const match = String(times[i]).match(/^(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/);
    if (!match) continue;

    const [, monthText, dayText, hourText, minuteText] = match;
    const month = Number(monthText);
    const day = Number(dayText);
    const hour = Number(hourText);
    const minute = Number(minuteText);

    if (
      previousMonth > 0 &&
      (month < previousMonth || (month === previousMonth && day < previousDay))
    ) {
      year += 1;
    }

    previousMonth = month;
    previousDay = day;

    const playerCount = Number(players[i]);
    if (!Number.isFinite(playerCount)) continue;

    points.push([
      isoFromShanghaiParts(year, month, day, hour, minute),
      playerCount,
    ]);
  }

  return points;
};

export const fetchMcmodHistory = async (serverId, start, end) => {
  const body = new URLSearchParams({
    data: JSON.stringify({ serverID: serverId, start, end }),
  });
  const res = await fetch(mcmodEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'User-Agent': 'CubeX-MC.github.io server history importer (https://cubexmc.org)',
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`MCMod returned ${res.status}`);
  }

  const text = (await res.text()).replace(/^\uFEFF/, '');
  const payload = JSON.parse(text);
  if (payload.state !== 0) {
    throw new Error(`MCMod state ${payload.state}`);
  }

  return parseMcmodSeries(JSON.parse(payload.data), start);
};

export const ensureHistoryEntry = (history, target) => {
  history.servers ??= {};
  history.servers[target.id] ??= {
    name: target.name,
    ip: target.ip,
    source: target.mcmodServerId
      ? {
          type: 'mcmod',
          serverId: target.mcmodServerId,
          url: `https://play.mcmod.cn/sv${target.mcmodServerId}.html`,
        }
      : { type: 'mcsrvstat' },
    points: [],
  };

  const entry = history.servers[target.id];
  entry.name = target.name;
  entry.ip = target.ip;
  entry.source = target.mcmodServerId
    ? {
        type: 'mcmod',
        serverId: target.mcmodServerId,
        url: `https://play.mcmod.cn/sv${target.mcmodServerId}.html`,
      }
    : { type: 'mcsrvstat' };
  entry.points ??= [];
  return entry;
};

export const mergePoints = (entry, newPoints) => {
  const merged = new Map(entry.points.map(([at, players]) => [at, Number(players)]));
  for (const [at, players] of newPoints) {
    merged.set(at, Number(players));
  }
  const next = Array.from(merged.entries()).sort(([a], [b]) => a.localeCompare(b));
  const changed = JSON.stringify(next) !== JSON.stringify(entry.points);
  entry.points = next;
  return changed;
};

export const summarizePoints = (points) => {
  let record = { players: 0, at: null };
  for (const [at, players] of points) {
    const value = Number(players || 0);
    if (record.at === null || value > record.players) {
      record = { players: value, at };
    }
  }
  return record;
};

export const updateRecordSummaryFromHistory = (records, target, historyEntry) => {
  records.servers ??= {};
  records.servers[target.id] ??= {
    name: target.name,
    ip: target.ip,
    edition: target.edition,
    record: { players: 0, max: null, at: null, version: null, motd: null },
    daily: [],
  };

  const entry = records.servers[target.id];
  const summary = summarizePoints(historyEntry.points);
  const previous = JSON.stringify(entry.record);

  entry.name = target.name;
  entry.ip = target.ip;
  entry.edition = target.edition;
  entry.record ??= {};
  entry.record.players = summary.players;
  entry.record.at = summary.at;
  entry.record.max ??= null;
  entry.record.version = null;
  entry.record.motd = null;

  return JSON.stringify(entry.record) !== previous;
};
