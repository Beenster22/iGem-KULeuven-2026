import { Children, ReactElement, ReactNode, isValidElement } from "react";

export interface LabeledChild {
  label: string;
  content: ReactNode;
}

// Reads label/children straight off compound-component children (e.g.
// <SectionItem label="..."> or <TabSection label="...">) without rendering them.
export function extractLabeledChildren(children: ReactNode): LabeledChild[] {
  return Children.toArray(children)
    .filter((child): child is ReactElement<{ label: string; children?: ReactNode }> => isValidElement(child))
    .map((child) => ({ label: child.props.label, content: child.props.children }));
}
