import type { Campaign, Store, User } from "./types";

export interface MatchResult {
  creator: User;
  score: number;
  reasons: { label: string; good: boolean }[];
  applied: boolean;
}

const STOP = new Set(["the", "and", "our", "your", "with", "for", "new", "a", "of", "in", "to", "you"]);
const words = (s: string) => new Set(s.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3 && !STOP.has(w)));

/** Score 0–100: niche 40, platform 25, rate vs budget 20, brief keyword overlap 15. */
export function scoreCreator(c: Campaign, creator: User, store: Store): MatchResult {
  const reasons: MatchResult["reasons"] = [];
  let score = 0;
  if (creator.niche === c.niche) { score += 40; reasons.push({ label: "Same niche", good: true }); }
  const plats = creator.platforms ?? [];
  const wanted = c.platform === "Both" ? ["TikTok", "Instagram"] : [c.platform];
  if (wanted.some((p) => plats.includes(p as never))) { score += 25; reasons.push({ label: "Posts on the right platform", good: true }); }
  if (creator.rate != null) {
    if (creator.rate <= c.budget) { score += 20; reasons.push({ label: "Rate fits your budget", good: true }); }
    else { score += Math.max(0, Math.round(20 * (1 - (creator.rate - c.budget) / c.budget))); reasons.push({ label: "Rate above budget", good: false }); }
  }
  const brief = words(`${c.title} ${c.description} ${c.deliverables}`);
  const bio = words(`${creator.bio ?? ""} ${creator.niche ?? ""}`);
  const overlap = [...bio].filter((w) => [...brief].some((b) => b.startsWith(w.slice(0, 5)) || w.startsWith(b.slice(0, 5)))).length;
  if (overlap) { score += Math.min(15, overlap * 5); reasons.push({ label: "Profile matches the brief", good: true }); }
  const applied = store.applications.some((a) => a.campaignId === c.id && a.creatorId === creator.id);
  return { creator, score: Math.min(100, score), reasons, applied };
}

export function matchCreators(c: Campaign, store: Store): MatchResult[] {
  return store.users.filter((u) => u.role === "creator").map((u) => scoreCreator(c, u, store)).sort((a, b) => b.score - a.score);
}

/** Creator-side narrowing. Defaults are exactly EMPTY_FILTERS, so isFiltered() stays honest. */
export interface MatchFilters {
  q: string;
  minScore: number;
  platform: string;
  niche: string;
  maxRate: number | null;
}

export const EMPTY_FILTERS: MatchFilters = { q: "", minScore: 0, platform: "All", niche: "All", maxRate: null };

export const PLATFORM_OPTIONS = ["All", "TikTok", "Instagram", "YouTube"] as const;
type Platform = NonNullable<User["platforms"]>[number];

/** True when anything narrows the list, so the UI can offer a way back out. */
export function isFiltered(f: MatchFilters): boolean {
  return f.q.trim() !== "" || f.minScore > 0 || f.platform !== EMPTY_FILTERS.platform || f.niche !== EMPTY_FILTERS.niche || f.maxRate !== null;
}

/** Keep the ranked creators that pass every active filter. Creator with no rate is never read as over budget. */
export function filterMatches(results: MatchResult[], f: MatchFilters): MatchResult[] {
  const q = f.q.trim().toLowerCase();
  return results.filter(({ creator, score }) => {
    if (q && !creator.name.toLowerCase().includes(q)) return false;
    if (score < f.minScore) return false;
    if (f.platform !== "All" && !(creator.platforms ?? []).includes(f.platform as Platform)) return false;
    if (f.niche !== "All" && creator.niche !== f.niche) return false;
    if (f.maxRate != null && creator.rate != null && creator.rate > f.maxRate) return false;
    return true;
  });
}

/** Niches that actually have a creator, so the filter never offers an empty choice. */
export function creatorNiches(users: User[]): string[] {
  const niches = new Set<string>();
  for (const u of users) if (u.role === "creator" && u.niche) niches.add(u.niche);
  return [...niches].sort();
}

/** Rate slider ceiling: the pricier of campaign budget and dearest creator, rounded up. */
export function rateCeiling(results: MatchResult[], budget: number): number {
  let max = budget;
  for (const r of results) if (r.creator.rate != null && r.creator.rate > max) max = r.creator.rate;
  return Math.max(500, Math.ceil(max / 500) * 500);
}
