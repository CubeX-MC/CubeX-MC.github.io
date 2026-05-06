import {
  endpointFor,
  ensureHistoryEntry,
  historyPath,
  mergePoints,
  normalizeDate,
  recordsPath,
  targetsPath,
  writeJson,
  writeCompactJson,
  readJson,
} from './server-history-utils.mjs';

const targets = await readJson(targetsPath);
const records = await readJson(recordsPath);
const history = await readJson(historyPath);

const now = new Date();
const nowIso = now.toISOString();
let changed = false;

const cleanMotd = (data) => {
  const lines = data?.motd?.clean;
  if (!Array.isArray(lines)) return null;
  const value = lines.filter(Boolean).join(' ').trim();
  return value || null;
};

const ensureRecordEntry = (target) => {
  records.servers ??= {};
  records.servers[target.id] ??= {
    name: target.name,
    ip: target.ip,
    edition: target.edition,
    record: {
      players: 0,
      max: null,
      at: null,
      version: null,
      motd: null,
    },
    daily: [],
  };

  const entry = records.servers[target.id];
  for (const key of ['name', 'ip', 'edition']) {
    if (entry[key] !== target[key]) {
      entry[key] = target[key];
      changed = true;
    }
  }
  entry.record ??= { players: 0, max: null, at: null, version: null, motd: null };
  entry.daily ??= [];
  return entry;
};

const recordDailySample = (entry, sample) => {
  const date = normalizeDate(new Date(sample.at));
  const daily = entry.daily;
  let day = daily.find((item) => item.date === date);
  if (!day) {
    day = { date, peak: -1, at: null, max: null, version: null };
    daily.push(day);
  }

  if (sample.players > day.peak) {
    day.peak = sample.players;
    day.at = sample.at;
    day.max = sample.max;
    day.version = sample.version;
    changed = true;
  }

  if (daily.length > 90) {
    entry.daily = daily.slice(-90);
    changed = true;
  }
};

const recordCurrentSample = (entry, sample) => {
  recordDailySample(entry, sample);

  const record = entry.record;
  if (record.at === null || sample.players > Number(record.players || 0)) {
    record.players = sample.players;
    record.max = sample.max;
    record.at = sample.at;
    record.version = sample.version;
    record.motd = sample.motd;
    changed = true;
  }
};

for (const target of targets) {
  const recordEntry = ensureRecordEntry(target);
  const historyEntry = ensureHistoryEntry(history, target);

  try {
    const res = await fetch(endpointFor(target), {
      headers: {
        'User-Agent': 'CubeX-MC.github.io server record updater (https://cubexmc.org)',
      },
    });

    if (!res.ok) {
      console.warn(`${target.name}: status API returned ${res.status}`);
      continue;
    }

    const data = await res.json();
    const sample = {
      at: nowIso,
      players: data.online ? Number(data.players?.online ?? 0) : 0,
      max: data.players?.max == null ? null : Number(data.players.max),
      version: data.version || data.protocol?.name || null,
      motd: cleanMotd(data),
    };

    if (mergePoints(historyEntry, [[sample.at, sample.players]])) {
      changed = true;
    }
    recordCurrentSample(recordEntry, sample);
    if (data.online) {
      console.log(`${target.name}: ${sample.players}/${sample.max ?? '?'} online`);
    } else {
      console.log(`${target.name}: offline, recorded 0 players`);
    }
  } catch (error) {
    console.warn(`${target.name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (changed) {
  history.updatedAt = nowIso;
  records.updatedAt = nowIso;
  await writeCompactJson(historyPath, history);
  await writeJson(recordsPath, records);
  console.log('Server records updated.');
} else {
  console.log('No new server records.');
}
