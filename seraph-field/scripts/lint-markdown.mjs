import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import katex from 'katex';
import mermaid from 'mermaid';

const supportedLanguages = new Set([
  'bash',
  'cpp',
  'c++',
  'cc',
  'cxx',
  'hpp',
  'cuda',
  'cu',
  'javascript',
  'js',
  'json',
  'markdown',
  'md',
  'python',
  'py',
  'typescript',
  'ts',
  'tsx',
  'mermaid',
]);

const severityRank = { error: 0, warning: 1 };
const ignoredDirectories = new Set(['.git', 'dist', 'node_modules']);

const toPosix = (value) => value.split(path.sep).join('/');

const makeIssue = (file, line, severity, rule, message) => ({
  file,
  line,
  severity,
  rule,
  message,
});

const collectMarkdownFiles = async (target) => {
  const stat = await fs.stat(target);

  if (stat.isFile()) {
    return target.toLowerCase().endsWith('.md') ? [target] : [];
  }

  if (!stat.isDirectory()) {
    return [];
  }

  const entries = await fs.readdir(target, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => !entry.isDirectory() || !ignoredDirectories.has(entry.name))
      .map((entry) => collectMarkdownFiles(path.join(target, entry.name))),
  );
  return nested.flat().sort((left, right) => left.localeCompare(right));
};

const findClosingDelimiter = (text, delimiter, start) => {
  for (let index = start; index <= text.length - delimiter.length; index += 1) {
    if (text.startsWith(delimiter, index) && text[index - 1] !== '\\') {
      return index;
    }
  }
  return -1;
};

const validateKatex = (expression, displayMode, file, line, issues) => {
  try {
    katex.renderToString(expression, {
      displayMode,
      output: 'html',
      throwOnError: true,
      strict: 'ignore',
    });
  } catch (error) {
    issues.push(
      makeIssue(
        file,
        line,
        'error',
        'MATH_KATEX_INVALID',
        error instanceof Error ? error.message : 'KaTeX parsing failed.',
      ),
    );
  }
};

const lintProseLine = (rawLine, file, lineNumber, issues) => {
  const inlineCodeRanges = [];
  const prose = rawLine.replace(/(`+)(.*?)\1/g, (match, _ticks, content, offset) => {
    inlineCodeRanges.push({ content, offset });
    return ' '.repeat(match.length);
  });

  inlineCodeRanges.forEach(({ content }) => {
    const delimitedMath = [...content.matchAll(/\${1,2}([^$]+)\${1,2}/g)].some(
      (match) => match[1].trim() !== '...',
    );
    if (/\\[A-Za-z]+/.test(content) || delimitedMath) {
      issues.push(
        makeIssue(
          file,
          lineNumber,
          'error',
          'MATH_IN_INLINE_CODE',
          'TeX 수식을 inline code 안에 넣지 마세요.',
        ),
      );
    }
  });

  if (/\\\(|\\\)|\\\[|\\\]/.test(prose)) {
    issues.push(
      makeIssue(
        file,
        lineNumber,
        'error',
        'MATH_DELIMITER_STYLE',
        '수식 구분자는 inline $...$ 또는 display $$...$$를 사용하세요.',
      ),
    );
  }

  if (/^\s*\|.*\${1,2}.*\|\s*$/.test(prose)) {
    issues.push(
      makeIssue(
        file,
        lineNumber,
        'error',
        'MATH_IN_TABLE',
        'Markdown table cell 안의 LaTeX는 별도 수식 블록으로 옮기세요.',
      ),
    );
  }

  let index = 0;
  while (index < prose.length) {
    if (prose[index] !== '$' || prose[index - 1] === '\\') {
      index += 1;
      continue;
    }

    const displayMode = prose[index + 1] === '$';
    const delimiter = displayMode ? '$$' : '$';
    const closing = findClosingDelimiter(prose, delimiter, index + delimiter.length);

    if (closing < 0) {
      issues.push(
        makeIssue(
          file,
          lineNumber,
          'error',
          'MATH_DELIMITER_UNCLOSED',
          `${delimiter} 수식 구분자가 닫히지 않았습니다.`,
        ),
      );
      return;
    }

    const expression = prose.slice(index + delimiter.length, closing).trim();
    if (!expression) {
      issues.push(
        makeIssue(file, lineNumber, 'error', 'MATH_EMPTY', '빈 수식 구분자를 제거하세요.'),
      );
    } else {
      validateKatex(expression, displayMode, file, lineNumber, issues);
    }
    index = closing + delimiter.length;
  }
};

const lintMermaid = async (chart, file, startLine, issues) => {
  const mathLabels = [...chart.matchAll(/\$\$([\s\S]*?)\$\$/g)];
  mathLabels.forEach((match) => {
    const expression = match[1];
    const offsetLine = chart.slice(0, match.index).split('\n').length - 1;
    if (/\\begin\{(?:matrix|pmatrix|bmatrix|vmatrix|Vmatrix|cases|aligned)\}/.test(expression)) {
      issues.push(
        makeIssue(
          file,
          startLine + offsetLine,
          'error',
          'MERMAID_COMPLEX_MATH',
          'Mermaid label의 matrix, cases, aligned 수식은 diagram 밖으로 옮기세요.',
        ),
      );
    }
    if (expression.includes('\n')) {
      issues.push(
        makeIssue(
          file,
          startLine + offsetLine,
          'error',
          'MERMAID_MULTILINE_MATH',
          'Mermaid label 안에는 여러 줄 수식을 사용하지 마세요.',
        ),
      );
    }
    validateKatex(expression.trim(), false, file, startLine + offsetLine, issues);
  });

  try {
    const parseableChart = chart
      .replace(/\$\$[\s\S]*?\$\$/g, 'math')
      .replace(/"(?:\\.|[^"\\])*"/g, 'label')
      .replace(
        /(\b[A-Za-z_][\w-]*)(?:\[\[label\]\]|\[\(label\)\]|\(\[label\]\)|\(\(label\)\)|\[label\]|\(label\)|\{label\}|>label\])/g,
        '$1',
      )
      .replace(/\|[^|\n]*\|/g, '');
    await mermaid.parse(parseableChart, { suppressErrors: false });
  } catch (error) {
    issues.push(
      makeIssue(
        file,
        startLine,
        'error',
        'MERMAID_SYNTAX_INVALID',
        error instanceof Error ? error.message.split('\n')[0] : 'Mermaid parsing failed.',
      ),
    );
  }
};

const lintMarkdown = async (absolutePath, displayPath) => {
  const markdown = await fs.readFile(absolutePath, 'utf8');
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const issues = [];
  let fence = null;
  let displayMath = null;
  let frontmatter = lines[0]?.trim() === '---';

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const lineNumber = index + 1;

    if (frontmatter) {
      if (lineNumber > 1 && line.trim() === '---') {
        frontmatter = false;
      }
      continue;
    }

    if (displayMath) {
      if (line.trim() === '$$') {
        const expression = displayMath.body.join('\n').trim();
        if (!expression) {
          issues.push(
            makeIssue(
              displayPath,
              displayMath.startLine,
              'error',
              'MATH_EMPTY',
              '빈 display math 블록을 제거하세요.',
            ),
          );
        } else {
          validateKatex(expression, true, displayPath, displayMath.startLine, issues);
        }
        displayMath = null;
      } else {
        displayMath.body.push(line);
      }
      continue;
    }

    const fenceMatch = /^(\s{0,3})(`{3,}|~{3,})(.*)$/.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[2];
      const info = fenceMatch[3].trim();

      if (!fence) {
        const infoParts = info.split(/\s+/).filter(Boolean);
        const language = infoParts[0]?.toLowerCase() ?? '';
        fence = {
          character: marker[0],
          length: marker.length,
          language,
          startLine: lineNumber,
          body: [],
        };

        if (!language) {
          issues.push(
            makeIssue(
              displayPath,
              lineNumber,
              'error',
              'CODE_LANGUAGE_MISSING',
              'fenced code block에 language를 지정하세요. 일반 텍스트는 text를 사용하세요.',
            ),
          );
        } else if (infoParts.length > 1) {
          issues.push(
            makeIssue(
              displayPath,
              lineNumber,
              'error',
              'CODE_FENCE_METADATA',
              'code fence info string에는 language 외 metadata를 넣지 마세요.',
            ),
          );
        }

        if (language && language !== 'text' && !supportedLanguages.has(language)) {
          issues.push(
            makeIssue(
              displayPath,
              lineNumber,
              'warning',
              'CODE_LANGUAGE_UNREGISTERED',
              `현재 syntax highlighter에 등록되지 않은 language입니다: ${language}`,
            ),
          );
        }
        continue;
      }

      if (marker[0] === fence.character && marker.length >= fence.length && !info) {
        if (fence.language === 'mermaid') {
          await lintMermaid(fence.body.join('\n'), displayPath, fence.startLine + 1, issues);
        }
        fence = null;
        continue;
      }
    }

    if (fence) {
      fence.body.push(line);
      continue;
    }

    if (line.trim() === '$$') {
      displayMath = { startLine: lineNumber, body: [] };
      continue;
    }

    lintProseLine(line, displayPath, lineNumber, issues);
  }

  if (frontmatter) {
    issues.push(
      makeIssue(displayPath, 1, 'error', 'FRONTMATTER_UNCLOSED', 'frontmatter가 닫히지 않았습니다.'),
    );
  }

  if (fence) {
    issues.push(
      makeIssue(
        displayPath,
        fence.startLine,
        'error',
        'CODE_FENCE_UNCLOSED',
        'fenced code block이 닫히지 않았습니다.',
      ),
    );
  }


  if (displayMath) {
    issues.push(
      makeIssue(
        displayPath,
        displayMath.startLine,
        'error',
        'MATH_DELIMITER_UNCLOSED',
        '$$ display math 블록이 닫히지 않았습니다.',
      ),
    );
  }

  return issues;
};

export const lintTarget = async (targetArgument) => {
  const target = path.resolve(targetArgument);
  const files = await collectMarkdownFiles(target);

  if (files.length === 0) {
    throw new Error(`Markdown files not found: ${target}`);
  }

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    htmlLabels: true,
    theme: 'base',
  });

  const commonRoot = (await fs.stat(target)).isDirectory() ? target : path.dirname(target);
  const issueGroups = await Promise.all(
    files.map((file) => lintMarkdown(file, toPosix(path.relative(commonRoot, file) || path.basename(file)))),
  );
  const issues = issueGroups.flat().sort(
    (left, right) =>
      left.file.localeCompare(right.file) ||
      left.line - right.line ||
      severityRank[left.severity] - severityRank[right.severity],
  );

  return { target, files, issues };
};

const printResult = ({ target, files, issues }) => {
  issues.forEach((issue) => {
    console.log(
      `${issue.file}:${issue.line} ${issue.severity.toUpperCase()} ${issue.rule} ${issue.message}`,
    );
  });

  const errors = issues.filter((issue) => issue.severity === 'error').length;
  const warnings = issues.length - errors;
  console.log(
    `Checked ${files.length} Markdown file(s) in ${target}: ${errors} error(s), ${warnings} warning(s).`,
  );
  return errors;
};

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  const targetArgument = process.argv[2];
  if (!targetArgument) {
    console.error('Usage: npm run lint:markdown -- <folder-or-markdown-file>');
    process.exitCode = 2;
  } else {
    lintTarget(targetArgument)
      .then((result) => {
        process.exitCode = printResult(result) > 0 ? 1 : 0;
      })
      .catch((error) => {
        console.error(error instanceof Error ? error.message : error);
        process.exitCode = 2;
      });
  }
}
