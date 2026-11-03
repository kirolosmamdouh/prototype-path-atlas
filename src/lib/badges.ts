import type { Store, User } from "./types";

/** Achievement pills shown next to creator and brand names, inspired by freelance-platform badges. */
export type BadgeIcon = "crown" | "star" | "briefcase";

export interface Badge {
  label: string;
  icon: BadgeIcon;
  tone: "brand" | "pink";
}

export const TOP_RATED_FOLLOWERS = 100_000;
export const RISING_STAR_FOLLOWERS = 50_000;

/** Creator pills: audience size sets the headline badge, any accepted proposal proves delivery. */
export function creatorBadges(creator: User, store: Store): Badge[] {
  const out: Badge[] = [];
  const followers = creator.followers ?? 0;
  if (followers >= TOP_RATED_FOLLOWERS) out.push({ label: "Top Rated", icon: "crown", tone: "brand" });
  else if (followers >= RISING_STAR_FOLLOWERS) out.push({ label: "Rising Star", icon: "star", tone: "pink" });
  const accepted = store.applications.filter((a) => a.creatorId === creator.id && a.status === "accepted").length;
  if (accepted >= 1) out.push({ label: "Proven Partner", icon: "briefcase", tone: "brand" });
  return out;
}

export const ACTIVE_HIRER_DEALS = 2;

/** Brand pills: enough accepted deals on their campaigns marks an active hirer. */
export function brandBadges(brand: User, store: Store): Badge[] {
  const mine = new Set(store.campaigns.filter((c) => c.userId === brand.id).map((c) => c.id));
  const accepted = store.applications.filter((a) => mine.has(a.campaignId) && a.status === "accepted").length;
  return accepted >= ACTIVE_HIRER_DEALS ? [{ label: "Active Hirer", icon: "briefcase", tone: "pink" }] : [];
}

export const JOB_SUCCESS_MIN = 90;

/** Share of decided proposals (accepted vs declined) that were accepted, 0–100; null before any decision. */
export function jobSuccess(creatorId: number, store: Store): number | null {
  const decided = store.applications.filter((a) => a.creatorId === creatorId && a.status !== "pending");
  if (!decided.length) return null;
  return Math.round((decided.filter((a) => a.status === "accepted").length / decided.length) * 100);
}

export const isTopRated = (u: User) => (u.followers ?? 0) >= TOP_RATED_FOLLOWERS;
export const hasJobSuccess = (u: User, store: Store) => (jobSuccess(u.id, store) ?? 0) >= JOB_SUCCESS_MIN;

export interface BadgeFilters { verified: boolean; topRated: boolean; jobSuccess: boolean }
export const EMPTY_BADGE_FILTERS: BadgeFilters = { verified: false, topRated: false, jobSuccess: false };

/** Every switched-on badge filter must hold for a creator to stay in the list. */
export function filterByBadges(users: User[], store: Store, f: BadgeFilters): User[] {
  return users.filter((u) =>
    (!f.verified || !!u.verified) && (!f.topRated || isTopRated(u)) && (!f.jobSuccess || hasJobSuccess(u, store)));
}

/** Plain-language rules shown to users so every badge is explainable. */
export const BADGE_CRITERIA: { label: string; rule: string }[] = [
  { label: "Verified", rule: "Identity and social accounts confirmed by UpCreator." },
  { label: "Top Rated", rule: "100,000+ followers across platforms." },
  { label: "Rising Star", rule: "50,000 to 99,999 followers." },
  { label: "Job Success", rule: "90%+ of decided proposals accepted." },
  { label: "Proven Partner", rule: "At least one accepted proposal." },
  { label: "Active Hirer", rule: "Brand with 2+ accepted deals." },
];
