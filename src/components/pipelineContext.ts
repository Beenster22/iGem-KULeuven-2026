import { createContext } from "react";

/** Given by ResultsPipelines: the tabs then switch the page's own pipeline. */
export const PipelineContext = createContext<{
  labels: string[];
  index: number;
  choose: (index: number) => void;
} | null>(null);
