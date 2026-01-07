// types.d.ts

import type React from "react";

// Define only the JSX elements you actually need to be loose about.
// If you don't use custom elements, you can omit this namespace entirely.
declare namespace JSX {
  interface IntrinsicElements {
    // Example: allow a custom web component <a2ui-panel />
    "a2ui-panel"?: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;

    // Add more specific custom tags here as needed.
    // Do NOT include a catch‑all [elemName: string]: any; as it disables JSX checking.
  }
}

// Remove the catch‑all `declare module "*";` to keep module typing strict.
// If you truly need a fallback for specific untyped modules, declare them explicitly, e.g.:
// declare module "some-legacy-lib";

// Prefer `import.meta.env` in a Vite + React app instead of `process.env`.
// If you need to type env vars, do it like this:

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Only declare `global` if you really need a Node-like global in browser code.
// In most React/Vite apps you can omit this entirely.
// declare var global: any;
