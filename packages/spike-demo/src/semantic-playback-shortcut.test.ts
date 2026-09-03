import { describe, expect, it } from "vitest";
import { shouldToggleSemanticPlayback } from "./use-semantic-playback";

function eventFor(target: Partial<HTMLElement> | null, overrides: Partial<KeyboardEvent> = {}) {
  return {
    key: " ",
    defaultPrevented: false,
    repeat: false,
    target,
    ...overrides,
  } as Pick<KeyboardEvent, "key" | "defaultPrevented" | "repeat" | "target">;
}

function target(tagName: string, role?: string, contentEditable = false): Partial<HTMLElement> {
  return {
    tagName,
    isContentEditable: contentEditable,
    getAttribute: (name: string) =>
      name === "role" ? role ?? null : contentEditable ? "true" : null,
  };
}

describe("semantic playback keyboard shortcut", () => {
  it("toggles only for an unhandled Space key outside focused controls", () => {
    expect(shouldToggleSemanticPlayback(eventFor(target("DIV")))).toBe(true);
    expect(shouldToggleSemanticPlayback(eventFor(null))).toBe(true);
    expect(shouldToggleSemanticPlayback(eventFor(target("DIV"), { key: "Enter" }))).toBe(false);
    expect(shouldToggleSemanticPlayback(eventFor(target("DIV"), { defaultPrevented: true }))).toBe(false);
    expect(shouldToggleSemanticPlayback(eventFor(target("DIV"), { repeat: true }))).toBe(false);
  });

  it("does not consume Space in text fields or focused controls", () => {
    for (const control of [
      target("INPUT"),
      target("TEXTAREA"),
      target("SELECT"),
      target("BUTTON"),
      target("DIV", "button"),
      target("DIV", undefined, true),
    ]) {
      expect(shouldToggleSemanticPlayback(eventFor(control))).toBe(false);
    }
  });
});
