import { ReactNode } from "react";

interface SectionItemProps {
  label: string;
  children: ReactNode;
}

// A labeled slot for use inside WheelSelector / SegmentedSelector. Never
// rendered directly — the parent selector reads its props via
// extractLabeledChildren instead.
export function SectionItem({ children }: SectionItemProps) {
  return <>{children}</>;
}
