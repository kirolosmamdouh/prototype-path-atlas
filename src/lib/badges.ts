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
