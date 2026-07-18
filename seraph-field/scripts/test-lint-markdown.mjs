import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { lintTarget } from './lint-markdown.mjs';

const fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'seraph-markdown-lint-'));

try {
  await fs.writeFile(
    path.join(fixtureRoot, 'valid.md'),
    [
      '# Valid',
      '',
      'Inline $x^2$.',
      '',
      '$$',
      '\\frac{1}{2}',
      '$$',
      '',
      '```mermaid',
      'flowchart LR',
      'A --> B',
      '```',
      '',
      '```python',
      'print("ok")',
      '```',
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    path.join(fixtureRoot, 'invalid.md'),
    [
      '# Invalid',
      '',
      'Broken $\\frac{1}{$.',
      '',
      '`$x^2$`',
      '',
      '| value |',
      '| --- |',
      '| $x^2$ |',
      '',
      '```mermaid',
      'flowchart LR',
      'A -->',
      '```',
      '',
      '```',
      'missing language',
      '```',
    ].join('\n'),
    'utf8',
  );

  const result = await lintTarget(fixtureRoot);
  const rules = new Set(result.issues.map((issue) => issue.rule));

  assert.equal(result.files.length, 2);
  assert(rules.has('MATH_KATEX_INVALID'));
  assert(rules.has('MATH_IN_INLINE_CODE'));
  assert(rules.has('MATH_IN_TABLE'));
  assert(rules.has('MERMAID_SYNTAX_INVALID'));
  assert(rules.has('CODE_LANGUAGE_MISSING'));
  assert.equal(result.issues.some((issue) => issue.file === 'valid.md'), false);

  console.log(`Markdown lint self-test passed with ${result.issues.length} expected issue(s).`);
} finally {
  await fs.rm(fixtureRoot, { recursive: true, force: true });
}
