// Generated with Claude Opus 5.5 (Anthropic), 2026-10-11
// Purpose: a row of numbered "Question N" cards, one per <Question>. Clicking
// a card shows that question's answer below. Used for the Entrepreneurship
// page's Regulatory strategy section. <InfoCards>/<InfoCard> are the small
// titled boxes used inside an answer.
import { Children, ReactElement, ReactNode, isValidElement, useMemo, useState } from "react";

interface QuestionProps {
  /** The question shown on the card. */
  label: string;
  /** Heading shown above the answer once the card is selected. */
  title?: string;
  children?: ReactNode;
}

// A labeled slot for use inside QuestionSelector. Never rendered directly —
// the selector reads its props instead (same pattern as SectionItem).
export function Question({ children }: QuestionProps) {
  return <>{children}</>;
}

export function QuestionSelector({ children }: { children: ReactNode }) {
  const questions = useMemo(
    () =>
      Children.toArray(children)
        .filter((child): child is ReactElement<QuestionProps> => isValidElement(child))
        .map((child) => child.props),
    [children],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const active = questions[activeIndex];

  return (
    <div className="question-selector">
      <p className="question-selector-hint">Select a question.</p>
      <div className="question-selector-cards" role="tablist">
        {questions.map((question, index) => (
          <button
            key={question.label}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            className={`question-selector-card${index === activeIndex ? " active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            <span className="question-selector-card-number">Question {index + 1}</span>
            <span className="question-selector-card-label">{question.label}</span>
          </button>
        ))}
      </div>
      {active && (
        <div className="question-selector-content" key={activeIndex} role="tabpanel">
          {active.title && <p className="question-selector-content-title">{active.title}</p>}
          {active.children}
        </div>
      )}
    </div>
  );
}

interface InfoCardProps {
  title: string;
  tone?: "teal" | "lilac";
  children?: ReactNode;
}

export function InfoCard({ title, tone = "teal", children }: InfoCardProps) {
  return (
    <div className={`info-card info-card--${tone}`}>
      <p className="info-card-title">{title}</p>
      {children}
    </div>
  );
}

export function InfoCards({ children }: { children: ReactNode }) {
  return <div className="info-cards">{children}</div>;
}
