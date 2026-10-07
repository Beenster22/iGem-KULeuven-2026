// Generated with Claude Opus 5.5 (Anthropic), 2026-10-06
// Purpose: an image that opens fullscreen when clicked, for detailed figures
// that are hard to read at column width. Use in .mdx as
// <ZoomableImage src="…" alt="…" />; click anywhere or press Esc to close.
import { useRef } from "react";

interface ZoomableImageProps {
  src: string;
  alt: string;
}

export function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className="zoomable-image-trigger"
        aria-label={`View fullscreen: ${alt}`}
        onClick={() => dialogRef.current?.showModal()}
      >
        <img src={src} alt={alt} className="img-fluid rounded" />
      </button>
      <dialog
        ref={dialogRef}
        className="zoomable-image-dialog"
        aria-label={alt}
        onClick={() => dialogRef.current?.close()}
      >
        <img src={src} alt={alt} />
        <button
          type="button"
          className="zoomable-image-close"
          aria-label="Close fullscreen image"
        >
          &times;
        </button>
      </dialog>
    </>
  );
}
