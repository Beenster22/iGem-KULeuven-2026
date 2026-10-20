// Generated with Claude Sonnet 5.5 (Anthropic), 2026-10-20
// Purpose: turns a pages.ts folder name ("Project", "Lab") into the
// data-folder value Header.tsx and Navbar.tsx both key their folder
// color-coding CSS off of (App.css's .page-header-box[data-folder],
// .mega-menu[data-folder], .nav-link-dropdown[data-folder]). Kept out of
// Header.tsx (a component file) so react-refresh/only-export-components
// doesn't flag it.
export function folderSlug(folder: string | undefined) {
  return folder?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
