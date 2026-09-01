import { describe, expect, it } from "vitest";
import { initialFixtureFromSearch } from "./initial-fixture";

describe("initial fixture routing", () => {
  it("opens the semantic editorial fixture from a validation URL", () => {
    expect(initialFixtureFromSearch("?fixture=semantic-editorial")).toBe("semantic-editorial");
  });

  it("preserves bridge query parameters while resolving the fixture", () => {
    expect(initialFixtureFromSearch("?bridge=1&fixture=semantic-editorial")).toBe(
      "semantic-editorial",
    );
  });

  it("falls back to the normal product fixture for unknown or absent values", () => {
    expect(initialFixtureFromSearch("")).toBe("product");
    expect(initialFixtureFromSearch("?fixture=unknown")).toBe("product");
  });
});
