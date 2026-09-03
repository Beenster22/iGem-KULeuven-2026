import { defineConfig, loadEnv, ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";
import { stringToSlug } from "./src/utils/stringToSlug";
import remarkGfm from "remark-gfm";
import { remarkAutoReferences } from "./src/mdx/remarkAutoReferences";
import { rehypeReferences } from "./src/mdx/rehypeReferences";

// https://vitejs.dev/config/
export default async ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd());
  const mdx = (await import("@mdx-js/rollup")).default;

  return defineConfig({
    base: process.env.GITHUB_PAGES ? "/iGem-KULeuven-2026/" : `/${stringToSlug(env.VITE_TEAM_NAME)}/`,
    plugins: [
      react(),
      mdx({
        providerImportSource: "@mdx-js/react",
        // remarkGfm enables [^1] footnote syntax for inline references;
        // remarkAutoReferences additionally lets [ref: full text] be
        // written inline with no id to invent (see the file for how);
        // rehypeReferences turns the resulting footnote list into a
        // collapsible "References" panel (see src/mdx/rehypeReferences.ts).
        remarkPlugins: [remarkGfm, remarkAutoReferences],
        rehypePlugins: [rehypeReferences],
      })
    ],
  });
};