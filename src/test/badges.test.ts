import { describe, expect, it } from "vitest";
import { ACTIVE_HIRER_DEALS, RISING_STAR_FOLLOWERS, TOP_RATED_FOLLOWERS, brandBadges, creatorBadges } from "@/lib/badges";
import { SEED } from "@/lib/seed";
import type { User } from "@/lib/types";

const creator = (id: number, followers?: number): User => ({
  id, name: "Test", email: "t@t.com", password: "x", role: "creator",
  ...(followers !== undefined ? { followers } : {}),
});
const empty: typeof SEED = { ...SEED, applications: [] };

describe("creator badges", () => {
  it("gives Top Rated at 100k followers", () => {
    const badges = creatorBadges(creator(9, TOP_RATED_FOLLOWERS), empty);
    expect(badges.map((b) => b.label)).toEqual(["Top Rated"]);
  });
  it("gives Rising Star from 50k up to 100k followers", () => {
    expect(creatorBadges(creator(9, RISING_STAR_FOLLOWERS), empty).map((b) => b.label)).toEqual(["Rising Star"]);
    expect(creatorBadges(creator(9, TOP_RATED_FOLLOWERS - 1), empty).map((b) => b.label)).toEqual(["Rising Star"]);
  });
  it("gives no audience badge below 50k or when followers are unknown", () => {
    expect(creatorBadges(creator(9, RISING_STAR_FOLLOWERS - 1), empty)).toEqual([]);
    expect(creatorBadges(creator(9), empty)).toEqual([]);
  });
  it("adds Proven Partner once a proposal was accepted", () => {
    const store = { ...empty, applications: [{ id: 1, campaignId: 1, creatorId: 9, pitch: "", rate: 1, status: "accepted" as const, createdAt: "" }] };
    expect(creatorBadges(creator(9), store).map((b) => b.label)).toEqual(["Proven Partner"]);
  });
  it("seed: Salma is Top Rated and a Proven Partner, Omar is a Rising Star", () => {
    expect(creatorBadges(SEED.users.find((u) => u.id === 2)!, SEED).map((b) => b.label)).toEqual(["Top Rated", "Proven Partner"]);
    expect(creatorBadges(SEED.users.find((u) => u.id === 3)!, SEED).map((b) => b.label)).toEqual(["Rising Star"]);
  });
});

describe("brand badges", () => {
  const brand = (id: number): User => ({ id, name: "B", email: "b@b.com", password: "x", role: "brand" });
  it("marks a brand as Active Hirer after two accepted deals", () => {
    const apps = Array.from({ length: ACTIVE_HIRER_DEALS }, (_, i) => ({ id: i + 1, campaignId: 1, creatorId: 2, pitch: "", rate: 1, status: "accepted" as const, createdAt: "" }));
    const store = { ...empty, applications: apps };
    expect(brandBadges(brand(1), store).map((b) => b.label)).toEqual(["Active Hirer"]);
  });
  it("gives nothing below two accepted deals", () => {
    expect(brandBadges(brand(1), empty)).toEqual([]);
    expect(brandBadges(SEED.users.find((u) => u.id === 1)!, SEED)).toEqual([]);
  });
});

import { EMPTY_BADGE_FILTERS, JOB_SUCCESS_MIN, filterByBadges, jobSuccess } from "@/lib/badges";
describe("badge filters", () => {
  const app = (id: number, status: "accepted" | "rejected" | "pending") => ({ id, campaignId: 1, creatorId: 9, pitch: "", rate: 1, status, createdAt: "" });
  it("job success is accepted share of decided proposals, ignoring pending", () => {
    const s = { ...empty, applications: [app(1, "accepted"), app(2, "rejected"), app(3, "pending")] };
    expect(jobSuccess(9, s)).toBe(50);
    expect(jobSuccess(9, empty)).toBeNull();
    expect(JOB_SUCCESS_MIN).toBe(90);
  });
  it("verified and top rated filters keep only matching creators", () => {
    const a = { ...creator(1, TOP_RATED_FOLLOWERS), verified: true };
    const b = creator(2, 10);
    expect(filterByBadges([a, b], empty, { ...EMPTY_BADGE_FILTERS, verified: true })).toEqual([a]);
    expect(filterByBadges([a, b], empty, { ...EMPTY_BADGE_FILTERS, topRated: true })).toEqual([a]);
    expect(filterByBadges([a, b], empty, { ...EMPTY_BADGE_FILTERS, jobSuccess: true })).toEqual([]);
  });
});
