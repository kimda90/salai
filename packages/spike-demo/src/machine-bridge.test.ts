import { describe, expect, it } from "vitest";
import { bridgeUrlFromLocation } from "./machine-bridge";

function locationWith(query: string): Location {
  return new URL(`http://localhost/${query}`) as unknown as Location;
}

describe("machine bridge URL", () => {
  it("uses the default loopback bridge when enabled without an override", () => {
    expect(bridgeUrlFromLocation(locationWith("?bridge"))).toBe("http://127.0.0.1:4317");
  });

  it("accepts explicit loopback bridge URLs", () => {
    expect(
      bridgeUrlFromLocation(locationWith("?bridge=http%3A%2F%2Flocalhost%3A5000")),
    ).toBe("http://localhost:5000");
  });

  it("rejects non-loopback bridge URLs", () => {
    expect(
      bridgeUrlFromLocation(locationWith("?bridge=https%3A%2F%2Fexample.com%2Fbridge")),
    ).toBeNull();
  });
});
