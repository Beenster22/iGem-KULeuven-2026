// Generated with Claude Sonnet 5 (Anthropic), 2026-09-09
// Purpose: grid of team member cards for the Team page. Click a card to open
// a popup with a bigger photo on the left and details on the right.
// Edited with Claude Opus 5.5 (Anthropic), 2026-10-15 (team request): the
// students' photos are now cut-outs on a transparent background, taken at
// different distances, so each can be given a `crop` that frames the head at
// the same size and height (see PhotoImg), and the frames behind them stay
// light in dark mode too (App.css). Also from the team's "TEAM PAGE" document:
// the subteam rows are replaced by a favourite movie/book and a fun fact, a
// member can have a LinkedIn link (under the photo in the popup), and `rows`
// sets how many cards go on each row.
import {
  Children,
  CSSProperties,
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
  /** Favourite movie or book. */
  favourite?: string;
  funFact?: string;
  /** LinkedIn profile URL. */
  linkedin?: string;
  photo?: string;
  /** Degrees to turn the photo clockwise (e.g. -90), for a file that was
      uploaded sideways. */
  rotate?: number;
  /** The square of the photo to show, as fractions of the photo's width:
      left edge, top edge and side length. Without it the middle is shown. */
  crop?: PhotoCrop;
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
  favourite?: string;
  funFact?: string;
  linkedin?: string;
  photo?: string;
  rotate?: number;
  crop?: PhotoCrop;
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
      favourite: child.props.favourite,
      funFact: child.props.funFact,
      linkedin: child.props.linkedin,
      photo: child.props.photo,
      rotate: child.props.rotate,
      crop: child.props.crop,
      bio: child.props.children,
    }));
}

// Generated with Claude Opus 5.5 (Anthropic), 2026-10-11
// Purpose: iGEM's servers cache an uploaded photo for two years, so a file
// that went up sideways can't simply be replaced under the same name. Both
// photo frames are square, so turning the <img> itself keeps it filling them.
function rotateStyle(rotate?: number) {
  return rotate ? { transform: `rotate(${rotate}deg)` } : undefined;
}

// iGEM's servers tell browsers to keep an uploaded file for two years, so
// after the photos were replaced under the same names (2026-10-14) anyone who
// had seen the page kept seeing the old ones. A version tag makes the URL new
// to the browser, which then fetches the current file; the server ignores it.
// Bump it whenever photos are replaced again.
const PHOTO_VERSION = "2026-10-14";

function photoSrc(url: string) {
  return `${url}${url.includes("?") ? "&" : "?"}v=${PHOTO_VERSION}`;
}

interface PhotoCrop {
  x: number;
  y: number;
  size: number;
}

// The member's photo filling its (square, overflow-hidden) frame: either the
// middle of it, or the `crop` square scaled up to fill the frame.
function PhotoImg({ member }: { member: Member }) {
  if (!member.photo) return null;
  const { crop } = member;
  const style: CSSProperties = { ...rotateStyle(member.rotate) };
  if (crop) {
    Object.assign(style, {
      position: "absolute",
      width: `${100 / crop.size}%`,
      maxWidth: "none",
      height: "auto",
      left: `${(-crop.x / crop.size) * 100}%`,
      top: `${(-crop.y / crop.size) * 100}%`,
      objectFit: "fill",
    });
  }
  return <img src={photoSrc(member.photo)} alt={`Photo of ${member.name}`} style={style} />;
}

interface TeamMembersProps {
  /** Cards per row, top to bottom (e.g. [2, 3, 3, 4]); the rows are centred.
      Without it the cards simply fill the grid. */
  rows?: number[];
  children: ReactNode;
}

// The members split into rows of the given sizes; anyone left over goes on
// one more row.
function splitRows<T>(items: T[], sizes: number[]): T[][] {
  const result: T[][] = [];
  let start = 0;
  for (const size of sizes) {
    if (start >= items.length) break;
    result.push(items.slice(start, start + size));
    start += size;
  }
  if (start < items.length) result.push(items.slice(start));
  return result;
}

// LinkedIn's "in" mark, drawn here as the site loads nothing from outside.
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect width="24" height="24" rx="4" fill="currentColor" />
      <g fill="var(--team-linkedin-fg)">
        <rect x="5" y="9.5" width="3" height="9" />
        <circle cx="6.5" cy="6.2" r="1.8" />
        <path d="M10.5 9.5h2.9v1.3c.5-.9 1.6-1.6 3.1-1.6 2.6 0 3.5 1.6 3.5 4.3v5h-3v-4.5c0-1.2-.3-2.1-1.5-2.1s-1.9.9-1.9 2.1v4.5h-3.1z" />
      </g>
    </svg>
  );
}

export function TeamMembers({ rows, children }: TeamMembersProps) {
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

  const renderCard = (member: Member) => (
    <button
      key={member.name}
      type="button"
      className="team-member-card"
      onClick={() => setOpenIndex(members.indexOf(member))}
    >
      <span className="team-member-card-photo">
        <span className="team-member-photo-frame">
          <PhotoImg member={member} />
        </span>
      </span>
      <span className="team-member-card-name">{member.name}</span>
      <span className="team-member-card-role">{member.role}</span>
    </button>
  );

  return (
    <>
      {rows ? (
        <div className="team-members-rows">
          {splitRows(members, rows).map((row) => (
            <div key={row[0].name} className="team-members-row">
              {row.map(renderCard)}
            </div>
          ))}
        </div>
      ) : (
        <div className="team-members-grid">{members.map(renderCard)}</div>
      )}

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
            <div className="team-member-modal-side">
              <div className="team-member-modal-photo">
                <PhotoImg member={openMember} />
              </div>
              {openMember.linkedin && (
                <a
                  className="team-member-modal-linkedin"
                  href={openMember.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${openMember.name} on LinkedIn`}
                >
                  <LinkedInIcon />
                </a>
              )}
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
                {openMember.favourite && (
                  <>
                    <dt>Favourite movie / book</dt>
                    <dd>{openMember.favourite}</dd>
                  </>
                )}
                {openMember.funFact && (
                  <>
                    <dt>Fun fact</dt>
                    <dd>{openMember.funFact}</dd>
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
