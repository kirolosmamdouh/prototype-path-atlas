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
