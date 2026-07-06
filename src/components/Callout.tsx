import { ReactNode } from "react";

interface CalloutProps {
  title: string;
  children: ReactNode;
}

export function Callout({ title, children }: CalloutProps) {
  return (
    <div className="bd-callout bd-callout-info">
      <h4>{title}</h4>
      {children}
    </div>
  );
}
