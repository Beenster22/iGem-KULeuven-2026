import { ReactNode } from "react";

interface SectionItemProps {
  label: string;
  /** Small icon shown next to the label on a WheelSelector wedge, if given. */
  icon?: ReactNode;
  children: ReactNode;
}

// A labeled slot for use inside WheelSelector / SegmentedSelector. Never
// rendered directly — the parent selector reads its props via
// extractLabeledChildren instead.
export function SectionItem({ children }: SectionItemProps) {
  return <>{children}</>;
}
