// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-20
// Purpose: one table of the Parts page (Basic Parts or Composite Parts), laid
// out like last year's team's: Part code (linked to the iGEM Registry), Part
// name, Usage. Rows come from data/parts.ts.
import { Link } from "react-router-dom";
import { PARTS, type PartType } from "./data/parts";

const registryUrl = (code: string) =>
  `https://registry.igem.org/parts/${code.toLowerCase().replace(/_/g, "-")}`;

export function PartsTable({ type }: { type: PartType }) {
  const parts = PARTS.filter((part) => part.type === type);
  return (
    <div className="table-responsive">
      <table className="parts-table">
        <thead>
          <tr>
            <th scope="col">Part code</th>
            <th scope="col">Part name</th>
            <th scope="col">Usage</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part, i) => (
            <tr key={`${part.code}-${i}`}>
              <td>
                <a href={registryUrl(part.code)} target="_blank" rel="noreferrer">
                  {part.code}
                </a>
                {part.footnote && <sup aria-label="see note below">*</sup>}
              </td>
              <td>{part.name}</td>
              <td>{part.usage}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {parts.map(
        (part) =>
          part.footnote && (
            <p key={part.code} className="parts-footnote">
              * <strong>{part.code}</strong>: {part.footnote}
              {part.footnoteLink && (
                <>
                  {" "}
                  <Link to={part.footnoteLink.to}>{part.footnoteLink.text}</Link>).
                </>
              )}
            </p>
          ),
      )}
    </div>
  );
}
