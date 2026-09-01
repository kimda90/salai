import { FIXTURES, type FixtureKey } from "./fixtures";

export function initialFixtureFromSearch(search: string): FixtureKey {
  const requested = new URLSearchParams(search).get("fixture");
  return FIXTURES.some((fixture) => fixture.key === requested)
    ? (requested as FixtureKey)
    : "product";
}
