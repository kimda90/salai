import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const toolsDir = dirname(fileURLToPath(import.meta.url));
const salaiCli = resolve(toolsDir, "salai.mjs");

describe("salai CLI discovery", () => {
  it("lists implemented tools without requiring the live bridge", () => {
    const stdout = execFileSync(process.execPath, [salaiCli, "tools"], {
      encoding: "utf8",
    });
    const manifest = JSON.parse(stdout);

    expect(manifest.version).toBe(1);
    expect(manifest.interface).toBe("salai-cli");
    expect(manifest.tools.map((tool) => tool.name)).toEqual([
      "context",
      "create-story",
      "apply",
    ]);
    expect(manifest.tools.every((tool) => typeof tool.description === "string")).toBe(true);
    expect(manifest.tools.every((tool) => typeof tool.mutatesProject === "boolean")).toBe(true);
  });
});
