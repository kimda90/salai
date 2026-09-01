import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { SalaiController, SalaiProvider } from "./controller";
import { initialFixtureFromSearch } from "./initial-fixture";
import { bridgeUrlFromLocation, startMachineBridge } from "./machine-bridge";
import "./style.css";
import "./av-script.css";
import "./paper-edit.css";

const rootElement = document.querySelector<HTMLElement>("#app");
if (!rootElement) throw new Error("Missing #app root");

const controller = new SalaiController(initialFixtureFromSearch(window.location.search));
const bridgeUrl = bridgeUrlFromLocation(window.location);
if (bridgeUrl) startMachineBridge(controller, bridgeUrl);

createRoot(rootElement).render(
  <StrictMode>
    <SalaiProvider controller={controller}>
      <App />
    </SalaiProvider>
  </StrictMode>,
);
