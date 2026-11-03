import type { ReactNode } from "react";
import { Avatar, BadgePill, VerifiedBadge } from "@/components/uc/ui";
import { JOB_SUCCESS_MIN, brandBadges, creatorBadges, jobSuccess } from "@/lib/badges";
import { useI18n, useLocalizedFormat } from "@/lib/i18n";
import type { Store, User } from "@/lib/types";

const Stat = ({ value, label }: { value: ReactNode; label: string }) => (
  <div className="rounded-2xl border p-4 text-center">
    <p className="text-xl font-extrabold">{value}</p>
    <p className="mt-1 text-xs text-muted-foreground">{label}</p>
  </div>
);

/** What brands see for a profile: identity, bio, platforms, earned badges and headline stats. */
export function PublicProfileCard({ person, store, action, extraStat, children }: { person: User; store: Store; action?: ReactNode; extraStat?: { value: ReactNode; label: string }; children?: ReactNode }) {
  const { t } = useI18n();
  const { fmt, currency } = useLocalizedFormat();
  const isCreator = person.role === "creator";
  const js = isCreator ? jobSuccess(person.id, store) : null;
  const badges = isCreator ? creatorBadges(person, store) : brandBadges(person, store);
  const sub = isCreator ? person.niche : person.company;
  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-start gap-5">
        <Avatar name={person.name} className="h-20 w-20 rounded-2xl text-2xl" />
        <div className="min-w-0 flex-1">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">{person.name} {person.verified && <VerifiedBadge className="h-5 w-5" />}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{sub ? `${t(sub)} · ` : ""}{t(person.location ?? "Egypt")}</p>
          {person.bio && <p className="mt-3 max-w-2xl text-sm">{person.bio}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {(person.platforms ?? []).map((p) => <span key={p} className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold">{t(p)}</span>)}
            {js != null && js >= JOB_SUCCESS_MIN && <BadgePill badge={{ label: "Job Success", icon: "crown", tone: "brand" }} suffix={`${js}%`} />}
            {badges.map((b) => <BadgePill key={b.label} badge={b} />)}
          </div>
        </div>
        {action}
      </div>
      {isCreator && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:max-w-lg sm:grid-cols-3">
          <Stat label={t("Rate")} value={person.rate != null ? <bdi>{currency} {fmt(person.rate)}</bdi> : "—"} />
          <Stat label={t("Followers")} value={person.followers != null ? <bdi>{fmt(person.followers)}</bdi> : "—"} />
          {extraStat && <Stat {...extraStat} />}
        </div>
      )}
      {children}
    </div>
  );
}
