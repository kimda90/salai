import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { SalaiController, SalaiProvider } from "./controller";
import "./style.css";
import "./authoring.css";
import "./av-script.css";
import "./paper-edit.css";

const rootElement = document.querySelector<HTMLElement>("#app");
if (!rootElement) throw new Error("Missing #app root");

const controller = new SalaiController("product");

createRoot(rootElement).render(
  <StrictMode>
    <SalaiProvider controller={controller}>
      <App />
    </SalaiProvider>
  </StrictMode>,
);
