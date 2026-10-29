import { describe, expect, it } from "vitest";
import { matchCreators, scoreCreator } from "@/lib/match";
import { SEED } from "@/lib/seed";

const serum = SEED.campaigns.find((c) => c.id === 1)!;
const sneakers = SEED.campaigns.find((c) => c.id === 3)!;

describe("creator match", () => {
  it("ranks the beauty creator first for the serum campaign", () => {
    expect(matchCreators(serum, SEED)[0].creator.name).toBe("Salma Hassan");
  });
  it("ranks the fashion creator first for the sneaker campaign", () => {
    expect(matchCreators(sneakers, SEED)[0].creator.name).toBe("Nour Adel");
  });
  it("penalises a rate above budget", () => {
    const creator = { ...SEED.users[1], rate: serum.budget * 2 };
    const r = scoreCreator(serum, creator, SEED);
    expect(r.reasons.some((x) => x.label === "Rate above budget")).toBe(true);
    expect(r.score).toBeLessThan(scoreCreator(serum, SEED.users[1], SEED).score);
  });
  it("only lists creators", () => {
    expect(matchCreators(serum, SEED).every((r) => r.creator.role === "creator")).toBe(true);
  });
});
