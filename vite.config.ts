import { defineConfig, loadEnv, ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";
import { stringToSlug } from "./src/utils/stringToSlug";
import remarkGfm from "remark-gfm";
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
        // rehypeReferences turns the footnote list it generates into a
        // collapsible "References" panel (see src/mdx/rehypeReferences.ts).
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeReferences],
      })
    ],
  });
};