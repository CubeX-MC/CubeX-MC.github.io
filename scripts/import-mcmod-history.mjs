import {
  ensureHistoryEntry,
  fetchMcmodHistory,
  historyPath,
  mergePoints,
  recordsPath,
  targetsPath,
  toShanghaiDate,
  updateRecordSummaryFromHistory,
  writeJson,
  writeCompactJson,
  readJson,
} from './server-history-utils.mjs';

const targets = await readJson(targetsPath);
const history = await readJson(historyPath);
const records = await readJson(recordsPath);

const args = new Map(
  process.argv
    .slice(2)
    .filter((arg) => arg.startsWith('--'))
    .map((arg) => {
      const [key, ...valueParts] = arg.slice(2).split('=');
      return [key, valueParts.join('=') || 'true'];
    }),
);

const today = toShanghaiDate(new Date());
const startOverride = args.get('start') || null;
const end = args.get('end') || today;
const serverIds = (args.get('server') || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
let changed = false;

for (const target of targets.filter((item) => (
  item.mcmodServerId &&
  (serverIds.length === 0 || serverIds.includes(item.id) || serverIds.includes(item.mcmodServerId))
))) {
  const start = startOverride || target.historyStartDate || '2019-05-01';
  console.log(`${target.name}: importing MCMod history ${start} to ${end}`);

  const points = await fetchMcmodHistory(target.mcmodServerId, start, end);
  const entry = ensureHistoryEntry(history, target);

  if (mergePoints(entry, points)) {
    changed = true;
    console.log(`${target.name}: merged ${points.length} points`);
  } else {
    console.log(`${target.name}: history already up to date`);
  }

  if (updateRecordSummaryFromHistory(records, target, entry)) {
    changed = true;
  }
}

if (changed) {
  history.updatedAt = new Date().toISOString();
  records.updatedAt = history.updatedAt;
  await writeCompactJson(historyPath, history);
  await writeJson(recordsPath, records);
  console.log('MCMod history import completed.');
} else {
  console.log('No MCMod history changes.');
}
