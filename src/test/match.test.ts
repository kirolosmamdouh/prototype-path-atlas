import { describe, expect, it } from "vitest";
import { EMPTY_FILTERS, creatorNiches, filterMatches, isFiltered, matchCreators, rateCeiling, scoreCreator } from "@/lib/match";
import { SEED } from "@/lib/seed";

const serum = SEED.campaigns.find((c) => c.id === 1)!;
const sneakers = SEED.campaigns.find((c) => c.id === 3)!;

describe("creator match", () => {
  it("ranks the beauty creator first for the serum campaign", () => {
    expect(matchCreators(serum, SEED)[0]!.creator.name).toBe("Salma Hassan");
  });
  it("ranks the fashion creator first for the sneaker campaign", () => {
    expect(matchCreators(sneakers, SEED)[0]!.creator.name).toBe("Nour Adel");
  });
  it("penalises a rate above budget", () => {
    const creator = { ...SEED.users[1]!, rate: serum.budget * 2 };
    const r = scoreCreator(serum, creator, SEED);
    expect(r.reasons.some((x) => x.label === "Rate above budget")).toBe(true);
    expect(r.score).toBeLessThan(scoreCreator(serum, SEED.users[1]!, SEED).score);
  });
  it("only lists creators", () => {
    expect(matchCreators(serum, SEED).every((r) => r.creator.role === "creator")).toBe(true);
  });
});

describe("match filters", () => {
  const results = matchCreators(serum, SEED);
  const names = (f: typeof EMPTY_FILTERS) => filterMatches(results, f).map((r) => r.creator.name);

  it("keeps everyone when nothing is narrowed", () => {
    expect(filterMatches(results, EMPTY_FILTERS)).toHaveLength(results.length);
    expect(isFiltered(EMPTY_FILTERS)).toBe(false);
    expect(isFiltered({ ...EMPTY_FILTERS, q: "   " })).toBe(false);
  });

  it("searches by name, ignoring case and stray spaces", () => {
    expect(names({ ...EMPTY_FILTERS, q: " salma " })).toEqual(["Salma Hassan"]);
    expect(isFiltered({ ...EMPTY_FILTERS, q: "salma" })).toBe(true);
  });

  it("keeps only creators at or above the chosen match score", () => {
    const r = filterMatches(results, { ...EMPTY_FILTERS, minScore: 70 });
    expect(r.every((x) => x.score >= 70)).toBe(true);
    expect(r.length).toBeGreaterThan(0);
    expect(r.length).toBeLessThan(results.length);
  });

  it("keeps only creators who post on the chosen platform", () => {
    const r = filterMatches(results, { ...EMPTY_FILTERS, platform: "YouTube" });
    expect(r.map((x) => x.creator.name).sort()).toEqual(["Karim Said", "Omar Fathy"]);
    expect(r.every((x) => x.creator.platforms?.includes("YouTube"))).toBe(true);
  });

  it("keeps only creators in the chosen niche", () => {
    expect(names({ ...EMPTY_FILTERS, niche: "Beauty" })).toEqual(["Salma Hassan"]);
  });

  it("drops creators whose rate is above the budget cap", () => {
    const r = filterMatches(results, { ...EMPTY_FILTERS, maxRate: serum.budget });
    expect(r.map((x) => x.creator.name)).toEqual(["Salma Hassan", "Omar Fathy", "Karim Said"]);
    expect(r.every((x) => (x.creator.rate ?? 0) <= serum.budget)).toBe(true);
  });

  it("combines filters", () => {
    expect(names({ ...EMPTY_FILTERS, q: "a", platform: "TikTok", niche: "Tech" })).toEqual(["Omar Fathy"]);
  });

  it("offers only niches that have a creator", () => {
    expect(creatorNiches(SEED.users)).toEqual(["Beauty", "Fashion", "Fitness", "Tech"]);
  });

  it("caps the rate slider above the priciest creator", () => {
    expect(rateCeiling(results, serum.budget)).toBe(5000);
    expect(rateCeiling([], 1200)).toBe(1500);
  });
});
