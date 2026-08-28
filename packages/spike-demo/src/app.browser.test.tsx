import { page } from "@vitest/browser/context";
import { afterEach, describe, expect, it } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { App } from "./App";
import { SalaiController, SalaiProvider } from "./controller";
import { orderedBeatRefs } from "./model-utils";

let root: Root | null = null;

function mountApp(fixture: "product" | "interview" | "documentary" = "product") {
  document.body.innerHTML = '<div id="test-root"></div>';
  const element = document.querySelector<HTMLElement>("#test-root");
  if (!element) throw new Error("Missing browser test root");

  const controller = new SalaiController(fixture);
  root = createRoot(element);
  root.render(
    <SalaiProvider controller={controller}>
      <App />
    </SalaiProvider>,
  );
  return controller;
}

afterEach(() => {
  root?.unmount();
  root = null;
  document.body.innerHTML = "";
});

describe("Spike 0B browser workflow", () => {
  it("renders and switches through all four authoring surfaces", async () => {
    mountApp();

    await expect.element(page.getByRole("heading", { name: "Outline" })).toBeInTheDocument();

    await page.getByRole("button", { name: "Story Wall" }).click();
    await expect.element(page.getByRole("heading", { name: "Story Wall" })).toBeInTheDocument();

    await page.getByRole("button", { name: "AV Script" }).click();
    await expect.element(page.getByRole("heading", { name: "AV Script" })).toBeInTheDocument();

    await page.getByRole("button", { name: "Paper / Radio Edit" }).click();
    await expect.element(page.getByRole("heading", { name: "Paper / Radio Edit" })).toBeInTheDocument();
  });

  it("propagates one Beat edit across Outline, Story Wall and AV Script without losing Workspace layout or selection", async () => {
    const controller = mountApp("product");
    const beatId = orderedBeatRefs(controller.getSnapshot().project)[0]?.beatId;
    if (!beatId) throw new Error("product fixture has no Beat");

    const itemId = `ref:beat:${beatId}`;
    const beforeItem = controller.getSnapshot().workspace.board.items[itemId];
    const title = "Browser-verified hook";

    await expect.element(page.getByRole("heading", { name: "Outline" })).toBeInTheDocument();
    const outlineTitle = document.querySelector<HTMLInputElement>(".beat-row .title-input");
    if (!outlineTitle) throw new Error("Outline Beat title input missing");
    await page.elementLocator(outlineTitle).fill(title);

    expect(controller.getSnapshot().project.beats[beatId]?.title).toBe(title);

    await page.getByRole("button", { name: "Story Wall" }).click();
    await expect.element(page.getByRole("heading", { name: "Story Wall" })).toBeInTheDocument();
    const wallTitle = Array.from(
      document.querySelectorAll<HTMLInputElement>(".beat-wall-card .wall-card-title"),
    ).find((input) => input.value === title);
    expect(wallTitle).toBeDefined();

    const afterItem = controller.getSnapshot().workspace.board.items[itemId];
    expect(afterItem?.x).toBe(beforeItem?.x);
    expect(afterItem?.y).toBe(beforeItem?.y);
    expect(afterItem?.parkingState).toBe(beforeItem?.parkingState);

    const wallCard = wallTitle?.closest<HTMLElement>(".beat-wall-card");
    if (!wallCard) throw new Error("Story Wall Beat card missing");
    await page.elementLocator(wallCard).click();
    expect(controller.getSnapshot().selection).toEqual({ type: "beat", id: beatId });

    await page.getByRole("button", { name: "AV Script" }).click();
    await expect.element(page.getByRole("heading", { name: "AV Script" })).toBeInTheDocument();
    expect(
      Array.from(document.querySelectorAll<HTMLInputElement>(".av-beat-title"))
        .some((input) => input.value === title),
    ).toBe(true);
    expect(document.querySelector(".av-beat-group.selected")).not.toBeNull();
  });

  it("keeps recorded SourceExcerpt cards read-only while authored Paper Edit text remains editable", async () => {
    const controller = mountApp("interview");

    await page.getByRole("button", { name: "Paper / Radio Edit" }).click();
    await expect.element(page.getByRole("heading", { name: "Paper / Radio Edit" })).toBeInTheDocument();

    const sourceCard = document.querySelector<HTMLElement>(".paper-audio-card.source-card");
    if (!sourceCard) throw new Error("Paper Edit source card missing");
    expect(sourceCard.querySelector("textarea")).toBeNull();
    expect(sourceCard.textContent).toContain("MediaSegment:");
    expect(sourceCard.textContent).toContain("Range preserved");

    const authoredEditor = document.querySelector<HTMLTextAreaElement>(
      ".paper-audio-card.authored-card .paper-authored-editor",
    );
    if (!authoredEditor) throw new Error("Paper Edit authored editor missing");
    await page.elementLocator(authoredEditor).fill("Browser-edited authored bridge.");

    expect(controller.getSnapshot().project.blocks.vo_bridge).toMatchObject({
      type: "authored_speech",
      text: "Browser-edited authored bridge.",
    });
    expect(controller.getSnapshot().project.blocks.quote_maria).toMatchObject({
      type: "source_excerpt",
      transcriptSnapshot: "We were spending almost two days doing this manually.",
      sourceInMs: 10_000,
      sourceOutMs: 37_000,
    });

    await page.getByRole("button", { name: "AV Script" }).click();
    await expect.element(page.getByRole("heading", { name: "AV Script" })).toBeInTheDocument();
    expect(
      Array.from(document.querySelectorAll<HTMLTextAreaElement>(".av-block textarea"))
        .some((textarea) => textarea.value === "Browser-edited authored bridge."),
    ).toBe(true);
  });
});
