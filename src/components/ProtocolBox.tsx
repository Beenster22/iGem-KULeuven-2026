// Generated with Claude Sonnet 5 (Anthropic), 2026-07-06
// Purpose: formatted materials/steps box for documenting wetlab protocols.
import { ReactNode } from "react";

interface ProtocolBoxProps {
  title: string;
  materials?: string[];
  steps: string[];
  children?: ReactNode;
}

export function ProtocolBox({
  title,
  materials,
  steps,
  children,
}: ProtocolBoxProps) {
  return (
    <div className="bd-callout bd-callout-info">
      <h4>{title}</h4>
      {children}
      {materials && materials.length > 0 && (
        <>
          <p>
            <strong>Materials</strong>
          </p>
          <ul>
            {materials.map((material) => (
              <li key={material}>{material}</li>
            ))}
          </ul>
        </>
      )}
      <p>
        <strong>Steps</strong>
      </p>
      <ol>
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
