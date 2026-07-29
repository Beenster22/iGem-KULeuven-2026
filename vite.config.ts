import { defineConfig, loadEnv, ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";
import { stringToSlug } from "./src/utils/stringToSlug";

// https://vitejs.dev/config/
export default async ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd());
  const mdx = (await import("@mdx-js/rollup")).default;

  return defineConfig({
    base: process.env.GITHUB_PAGES ? "/iGem-KULeuven-2026/" : `/${stringToSlug(env.VITE_TEAM_NAME)}/`,
    plugins: [
      react(),
      mdx({ providerImportSource: "@mdx-js/react" })
    ],
  });
};