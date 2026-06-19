import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projectsPath = resolve(root, 'src/data/projects.ts');
const outputPath = resolve(root, 'src/data/projectActivity.json');
const githubToken = process.env.GITHUB_TOKEN;
const maxProjects = Number.parseInt(process.env.PROJECT_ACTIVITY_LIMIT ?? '6', 10);

function extractProjects(source) {
  const projectPattern = /\{\s*name:\s*'([^']+)'[\s\S]*?repository:\s*'([^']+)'[\s\S]*?icon:\s*'[^']+'\s*,?\s*\}/g;
  return Array.from(source.matchAll(projectPattern), ([, name, repository]) => ({
    name,
    repository,
  }));
}

function timestampOf(project) {
  return new Date(project.pushedAt ?? project.updatedAt ?? 0).getTime();
}

async function fetchRepo({ name, repository }) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'CubeX-MC.github.io project activity updater',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  const response = await fetch(`https://api.github.com/repos/${repository}`, { headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${repository}: ${response.status} ${response.statusText} ${body.slice(0, 160)}`);
  }

  const repo = await response.json();
  return {
    name,
    repository,
    url: repo.html_url ?? `https://github.com/${repository}`,
    description: repo.description ?? null,
    defaultBranch: repo.default_branch ?? null,
    pushedAt: repo.pushed_at ?? null,
    updatedAt: repo.updated_at ?? null,
  };
}

async function main() {
  const source = await readFile(projectsPath, 'utf8');
  const projects = extractProjects(source);

  if (projects.length === 0) {
    throw new Error('No project repositories found in src/data/projects.ts');
  }

  const settled = await Promise.allSettled(projects.map(fetchRepo));
  const successful = settled
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value)
    .sort((a, b) => timestampOf(b) - timestampOf(a))
    .slice(0, Number.isFinite(maxProjects) ? maxProjects : 6);

  const failed = settled.filter((result) => result.status === 'rejected');
  for (const failure of failed) {
    console.warn(`Skipping project activity: ${failure.reason.message}`);
  }

  if (successful.length === 0) {
    throw new Error('Could not fetch activity for any project repository');
  }

  await writeFile(
    outputPath,
    `${JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        projects: successful,
      },
      null,
      2,
    )}\n`,
  );

  console.log(`Updated ${outputPath} with ${successful.length} project records.`);
}

await main();
