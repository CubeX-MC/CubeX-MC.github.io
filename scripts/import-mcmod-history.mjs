import {
  ensureHistoryEntry,
  fetchMcmodHistory,
  historyPath,
  mergePoints,
  pruneNonMcmodPoints,
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
const today = toShanghaiDate(new Date());
let changed = false;

for (const target of targets.filter((item) => item.mcmodServerId)) {
  const start = target.historyStartDate || '2019-05-01';
  console.log(`${target.name}: importing MCMod history ${start} to ${today}`);

  const points = await fetchMcmodHistory(target.mcmodServerId, start, today);
  const entry = ensureHistoryEntry(history, target);

  if (pruneNonMcmodPoints(entry)) {
    changed = true;
  }

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
