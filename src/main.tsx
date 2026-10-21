import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import App from "./containers/App/App.tsx";

// Import your custom components here
import { mdxComponents } from "./mdx-components";
import { preloadPages } from "./contents";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <MDXProvider components={mdxComponents}>
        <App />
      </MDXProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
// Once the page has loaded, fetch the other pages' chunks in the background.
window.addEventListener("load", preloadPages, { once: true });
