import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Only import test code in non-production environments to avoid bundling it
if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line import/no-import-module-exports, @typescript-eslint/no-var-requires
  require("./tests/logic.test");
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
