// Generated with Claude Sonnet 5 (Anthropic), 2026-07-06
// Purpose: profile card for a team member on the Team page.
import { ReactNode } from "react";

interface TeamMemberProps {
  name: string;
  role: string;
  photo?: string;
  children?: ReactNode;
}

export function TeamMember({ name, role, photo, children }: TeamMemberProps) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        {photo && (
          <img src={photo} className="card-img-top" alt={`Photo of ${name}`} />
        )}
        <div className="card-body">
          <h5 className="card-title mb-0">{name}</h5>
          <p className="text-muted">{role}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
