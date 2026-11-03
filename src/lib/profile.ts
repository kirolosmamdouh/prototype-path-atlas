import type { User } from "./types";

/** Fields that make a public profile complete, per role. */
export function profileCompletion(u: User): number {
  const fields: unknown[] = u.role === "brand"
    ? [u.name, u.company, u.location, u.bio]
    : [u.name, u.niche, u.location, u.bio, u.platforms?.length, u.rate, u.followers];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}
