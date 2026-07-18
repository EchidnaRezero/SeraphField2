import { useEffect, useId, useRef, useState } from 'react';

type MermaidModule = typeof import('mermaid').default;

type MermaidBlockProps = {
  chart: string;
};

let mermaidModulePromise: Promise<MermaidModule> | null = null;
let mermaidInitialized = false;

const getMermaid = async () => {
  if (!mermaidModulePromise) {
    mermaidModulePromise = import('mermaid').then((module) => module.default);
  }

  const mermaid = await mermaidModulePromise;

  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      htmlLabels: true,
      theme: 'base',
      themeVariables: {
        background: '#0e1012',
        primaryColor: '#08181a',
        primaryTextColor: '#e0fbfc',
        primaryBorderColor: '#19b8be',
        lineColor: '#19b8be',
        textColor: '#e0fbfc',
        fontFamily: '"Noto Sans KR", sans-serif',
        edgeLabelBackground: 'transparent',
      },
      flowchart: {
        padding: 24,
        curve: 'basis',
      },
    });
    mermaidInitialized = true;
  }

  return mermaid;
};

const normalizeSvgViewBox = (container: HTMLDivElement | null) => {
  const svg = container?.querySelector('svg');
  const graphRoot = container?.querySelector<SVGGElement>('svg g.root');

  if (!svg || !graphRoot || typeof graphRoot.getBBox !== 'function') {
    return;
  }

  try {
    const box = graphRoot.getBBox();

    if (box.width <= 0 || box.height <= 0) {
      return;
    }

    const padding = 18;
    svg.setAttribute(
      'viewBox',
      [
        Math.floor(box.x - padding),
        Math.floor(box.y - padding),
        Math.ceil(box.width + padding * 2),
        Math.ceil(box.height + padding * 2),
      ].join(' '),
    );
    svg.setAttribute('preserveAspectRatio', 'xMidYMin meet');
  } catch {
    // Some browsers cannot measure SVG text immediately; the original viewBox is acceptable.
  }
};

export const MermaidBlock = ({ chart }: MermaidBlockProps) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const [scale, setScale] = useState(1);
  const id = useId().replace(/:/g, '');
  const diagramRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;

    const render = async () => {
      try {
        const mermaid = await getMermaid();
        const result = await mermaid.render(`mermaid-${id}`, chart);

        if (!active) {
          return;
        }

        setSvg(result.svg);
        setError('');
      } catch (caught) {
        if (!active) {
          return;
        }

        setSvg('');
        setError(caught instanceof Error ? caught.message : 'Mermaid render failed');
      }
    };

    void render();

    return () => {
      active = false;
    };
  }, [chart, id]);

  useEffect(() => {
    if (!svg) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      normalizeSvgViewBox(diagramRef.current);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [svg]);

  if (error) {
    return (
      <div className="code-wrapper">
        <div className="code-header">
          <span>Mermaid Diagram</span>
          <span>[MERMAID ERROR]</span>
        </div>
        <pre className="mermaid-error">{chart}</pre>
      </div>
    );
  }

  return (
    <div className="mermaid-wrapper">
      <div className="mermaid-toolbar">
        <span className="mermaid-toolbar__zoom">{Math.round(scale * 100)}%</span>
        <div className="mermaid-toolbar__controls">
          <button
            type="button"
            className="mermaid-toolbar__button"
            onClick={() => setScale((current) => Math.max(0.7, Number((current - 0.15).toFixed(2))))}
          >
            -
          </button>
          <button
            type="button"
            className="mermaid-toolbar__button"
            onClick={() => setScale((current) => Math.min(2.5, Number((current + 0.15).toFixed(2))))}
          >
            +
          </button>
          <button
            type="button"
            className="mermaid-toolbar__button mermaid-toolbar__button--reset"
            onClick={() => setScale(1)}
          >
            reset
          </button>
        </div>
      </div>
      <div className="mermaid-surface">
        <div
          ref={diagramRef}
          className="mermaid-diagram"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  );
};
