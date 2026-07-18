import type { ComponentProps, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { MermaidBlock } from './MermaidBlock';

SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('c++', cpp);
SyntaxHighlighter.registerLanguage('cc', cpp);
SyntaxHighlighter.registerLanguage('cxx', cpp);
SyntaxHighlighter.registerLanguage('hpp', cpp);
SyntaxHighlighter.registerLanguage('cuda', cpp);
SyntaxHighlighter.registerLanguage('cu', cpp);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('md', markdown);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);

type ContentRendererProps = {
  markdown: string;
};

type CodeProps = ComponentProps<'code'> & {
  children?: ReactNode;
  className?: string;
};

const cppAliases = new Set(['c++', 'cc', 'cxx', 'hpp', 'cuda', 'cu']);

const CodeBlock = ({ children, className, ...props }: CodeProps) => {
  const match = /language-([^\s]+)/.exec(className ?? '');
  const language = match?.[1];
  const code = String(children ?? '').replace(/\n$/, '');

  if (language === 'mermaid') {
    return <MermaidBlock chart={code} />;
  }

  if (language) {
    const highlighterLanguage = cppAliases.has(language) ? 'cpp' : language;

    return (
      <div className="code-wrapper">
        <div className="code-header">
          <span>{language}</span>
          <span>[CODE]</span>
        </div>
        <SyntaxHighlighter
          language={highlighterLanguage}
          PreTag="pre"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            background: 'transparent',
            padding: '1rem',
          }}
          codeTagProps={{
            style: {
              background: 'transparent',
              fontFamily: 'var(--font-mono)',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export const ContentRenderer = ({ markdown }: ContentRendererProps) => (
  <div className="section-markdown">
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code: CodeBlock,
      }}
    >
      {markdown}
    </ReactMarkdown>
  </div>
);
