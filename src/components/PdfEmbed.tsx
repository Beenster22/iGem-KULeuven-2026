// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-20
// Purpose: show a PDF inline (e.g. in an event's popup) as plain pages, with none of the
// browser viewer's toolbar or sidebar. Several `srcs` are stitched into one continuous
// document (for a file that had to be split because of its size).
import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

interface PdfEmbedProps {
  title: string;
  /** One sentence introducing the document, shown above it. */
  intro?: string;
  src?: string;
  srcs?: string[];
}

interface PageRef {
  doc: PDFDocumentProxy;
  number: number;
  ratio: number; // height / width
}

async function loadPages(files: string[]): Promise<PageRef[]> {
  // Loaded on demand so pdf.js stays out of the main bundle.
  const pdfjs = await import("pdfjs-dist");
  const worker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = worker;

  const out: PageRef[] = [];
  for (const url of files) {
    const doc = await pdfjs.getDocument({ url }).promise;
    for (let number = 1; number <= doc.numPages; number++) {
      const page = await doc.getPage(number);
      const { width, height } = page.getViewport({ scale: 1 });
      out.push({ doc, number, ratio: height / width });
    }
  }
  return out;
}

function PdfPage({ page, width }: { page: PageRef; width: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0) return;
    let task: { promise: Promise<unknown>; cancel: () => void } | null = null;
    let cancelled = false;
    page.doc.getPage(page.number).then((p) => {
      if (cancelled) return;
      const base = p.getViewport({ scale: 1 });
      const scale = (width / base.width) * Math.min(window.devicePixelRatio || 1, 2);
      const viewport = p.getViewport({ scale });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      task = p.render({ canvas, viewport });
      task.promise.catch(() => {});
    });
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [page, width]);

  return (
    <canvas
      ref={canvasRef}
      className="pdf-embed-page"
      style={{ aspectRatio: `1 / ${page.ratio}` }}
    />
  );
}

export function PdfEmbed({ title, intro, src, srcs }: PdfEmbedProps) {
  const files = srcs ?? (src ? [src] : []);
  const key = files.join("|");
  const [pages, setPages] = useState<PageRef[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [width, setWidth] = useState(0);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPages(null);
    setFailed(false);
    loadPages(key.split("|"))
      .then((result) => !cancelled && setPages(result))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setWidth(Math.floor(el.clientWidth)), 150);
    };
    setWidth(Math.floor(el.clientWidth));
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  if (files.length === 0) return null;

  return (
    <figure className="pdf-embed">
      {intro && <p className="pdf-embed-intro">{intro}</p>}
      <figcaption className="pdf-embed-head">
        <span className="pdf-embed-title">{title}</span>
        {files.length === 1 && (
          <a className="pdf-embed-open" href={files[0]} target="_blank" rel="noreferrer">
            Open PDF ↗
          </a>
        )}
      </figcaption>
      <div className="pdf-embed-box" ref={boxRef} aria-label={title} tabIndex={0}>
        {pages?.map((page, i) => <PdfPage key={i} page={page} width={width} />)}
        {!pages && (
          <p className="pdf-embed-status">
            {failed ? "Couldn't load this PDF — use the link above." : "Loading…"}
          </p>
        )}
      </div>
    </figure>
  );
}
