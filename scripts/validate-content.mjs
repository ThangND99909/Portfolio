import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const directory = join(process.cwd(), 'content', 'projects');
const missing = [];

for (const file of readdirSync(directory).filter((name) => name.endsWith('.ts') && name !== 'index.ts')) {
  const source = readFileSync(join(directory, file), 'utf8');
  const project = source.match(/name:\s*'([^']+)'/)?.[1] ?? file;
  const decisionStart = source.indexOf('\n  decisions: [');
  const resultStart = source.indexOf('\n  results: [', decisionStart);
  const decisions = decisionStart >= 0 && resultStart >= 0
    ? source.slice(decisionStart, resultStart)
    : '';
  const blocks = decisions.split(/\n    \{(?=\n      title:)/).slice(1);

  for (const block of blocks) {
    const title = block.match(/title:\s*'([^']+)'/)?.[1];
    if (title && !/\n      content:\s*\{/.test(block)) missing.push(`${project}: ${title}`);
  }
}

if (missing.length > 0) {
  console.warn(
    `[content] ${missing.length} unpublished Key decisions (omitted from HTML):\n- ${missing.join('\n- ')}`,
  );
}
