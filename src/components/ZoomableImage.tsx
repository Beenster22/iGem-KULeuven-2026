// Generated with Claude Opus 5.5 (Anthropic), 2026-10-06
// Purpose: an image that opens fullscreen when clicked, for detailed figures
// that are hard to read at column width. Use in .mdx as
// <ZoomableImage src="…" alt="…" />; click anywhere or press Esc to close.
// Edited with Claude Sonnet 5 (Anthropic), 2026-10-18: added optional
// `className`, passed through to the thumbnail <img> so individual figures
// can opt into extra styling (e.g. a "framed" border + larger size) via CSS.
// Edited with Claude Sonnet 5.5 (Anthropic), 2026-10-18: added optional
// `onLightBackground`, for a figure drawn with a transparent background (the
// pBSH-Cas9 plasmid map) — against the dialog's dark backdrop it was
// unreadable, so this gives the fullscreen image its own white card instead.
// Edited with Claude Sonnet 5.5 (Anthropic), 2026-10-18: `onLightBackground`
// now also cards the inline thumbnail, not just the fullscreen dialog — in
// dark mode the same transparent-background figure was disappearing into the
// page's own dark background before it was ever clicked.
import { useRef } from "react";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  onLightBackground?: boolean;
}

export function ZoomableImage({
  src,
  alt,
  className,
  onLightBackground,
}: ZoomableImageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className="zoomable-image-trigger"
        aria-label={`View fullscreen: ${alt}`}
        onClick={() => dialogRef.current?.showModal()}
      >
        <img
          src={src}
          alt={alt}
          className={`img-fluid rounded${className ? ` ${className}` : ""}${
            onLightBackground ? " on-light-bg" : ""
          }`}
        />
      </button>
      <dialog
        ref={dialogRef}
        className="zoomable-image-dialog"
        aria-label={alt}
        onClick={() => dialogRef.current?.close()}
      >
        <img
          src={src}
          alt={alt}
          className={onLightBackground ? "on-light-bg" : undefined}
        />
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
