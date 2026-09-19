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

  it("opens filmmaking review by default and preserves explicit older fixtures", () => {
    expect(initialFixtureFromSearch("")).toBe("filmmaking");
    expect(initialFixtureFromSearch("?fixture=unknown")).toBe("filmmaking");
    expect(initialFixtureFromSearch("?bridge=1&fixture=filmmaking")).toBe("filmmaking");
    expect(initialFixtureFromSearch("?fixture=product")).toBe("product");
  });
});
