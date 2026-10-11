// Generated with Claude Sonnet 5 (Anthropic), 2026-09-09
// Purpose: grid of team member cards for the Team page. Click a card to open
// a popup with a bigger photo on the left and details on the right.
import {
  Children,
  ReactElement,
  ReactNode,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface TeamMemberCardProps {
  name: string;
  role: string;
  nationality?: string;
  /** Age, as collected from the team (students only). */
  age?: number;
  /** Degree and year, as the member wrote it. */
  study?: string;
  /** Subteams the member works in, comma separated. */
  teams?: string;
  /** Subteams they step into when a deadline needs the hands. */
  helpsWith?: string;
  photo?: string;
  /** Extra bio content shown only in the popup, not on the grid card. */
  children?: ReactNode;
}

// A labeled slot for use inside TeamMembers. Never rendered directly — the
// parent reads its props via extractMembers instead.
export function TeamMemberCard(_props: TeamMemberCardProps) {
  return null;
}

interface Member {
  name: string;
  role: string;
  nationality?: string;
  age?: number;
  study?: string;
  teams?: string;
  helpsWith?: string;
  photo?: string;
  bio: ReactNode;
}

function extractMembers(children: ReactNode): Member[] {
  return Children.toArray(children)
    .filter((child): child is ReactElement<TeamMemberCardProps> => isValidElement(child))
    .map((child) => ({
      name: child.props.name,
      role: child.props.role,
      nationality: child.props.nationality,
      age: child.props.age,
      study: child.props.study,
      teams: child.props.teams,
      helpsWith: child.props.helpsWith,
      photo: child.props.photo,
      bio: child.props.children,
    }));
}

interface TeamMembersProps {
  children: ReactNode;
}

export function TeamMembers({ children }: TeamMembersProps) {
  const members = useMemo(() => extractMembers(children), [children]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const openMember = openIndex !== null ? members[openIndex] : null;

  useEffect(() => {
    if (openIndex === null) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [openIndex]);

  useEffect(() => {
    if (openIndex !== null) modalRef.current?.focus();
  }, [openIndex]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (openIndex !== null && event.key === "Escape") setOpenIndex(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openIndex]);

  return (
    <>
      <div className="team-members-grid">
        {members.map((member, index) => (
          <button
            key={member.name}
            type="button"
            className="team-member-card"
            onClick={() => setOpenIndex(index)}
          >
            <span className="team-member-card-photo">
              {member.photo && <img src={member.photo} alt={`Photo of ${member.name}`} />}
            </span>
            <span className="team-member-card-name">{member.name}</span>
            <span className="team-member-card-role">{member.role}</span>
          </button>
        ))}
      </div>

      {openMember && (
        <div className="team-member-modal-backdrop" onClick={() => setOpenIndex(null)}>
          <div
            className="team-member-modal"
            role="dialog"
            aria-modal="true"
            aria-label={openMember.name}
            ref={modalRef}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="team-member-modal-close"
              onClick={() => setOpenIndex(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="team-member-modal-photo">
              {openMember.photo && <img src={openMember.photo} alt={`Photo of ${openMember.name}`} />}
            </div>
            <div className="team-member-modal-info">
              <h3 className="team-member-modal-name">{openMember.name}</h3>
              <p className="team-member-modal-role">{openMember.role}</p>
              {/* Generated with Claude Opus 5 (Anthropic), 2026-10-11: the
                  facts the team collected about each member. Every one is
                  optional — the PIs, advisors and coaches have none of them,
                  and their rows simply do not appear. */}
              <dl className="team-member-modal-facts">
                {openMember.nationality && (
                  <>
                    <dt>Nationality</dt>
                    <dd>{openMember.nationality}</dd>
                  </>
                )}
                {openMember.age !== undefined && (
                  <>
                    <dt>Age</dt>
                    <dd>{openMember.age}</dd>
                  </>
                )}
                {openMember.study && (
                  <>
                    <dt>Studies</dt>
                    <dd>{openMember.study}</dd>
                  </>
                )}
                {openMember.teams && (
                  <>
                    <dt>Subteams</dt>
                    <dd>{openMember.teams}</dd>
                  </>
                )}
                {openMember.helpsWith && (
                  <>
                    <dt>Also helps out in</dt>
                    <dd>{openMember.helpsWith}</dd>
                  </>
                )}
              </dl>
              {openMember.bio && <div className="team-member-modal-bio">{openMember.bio}</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
