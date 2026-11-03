import { useI18n } from "@/lib/i18n";
import type { ReactNode } from "react";
import { BadgeCheck, Briefcase, Crown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { BADGE_CRITERIA, type Badge, type BadgeIcon } from "@/lib/badges";
import type { ApplicationStatus, CampaignStatus } from "@/lib/types";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  const { t, language } = useI18n();
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t(title)}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{t(subtitle)}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, sub, accent }: { label: string; value: ReactNode; sub?: string; accent?: boolean }) {
  const { t, language } = useI18n();
  return (
    <div className={cn("rounded-2xl border p-5", accent ? "border-transparent bg-brand-gradient text-primary-foreground" : "bg-card")}>
      <p className={cn("text-xs font-semibold uppercase tracking-wider", accent ? "opacity-90" : "text-muted-foreground")}>{t(label)}</p>
      <p className="mt-2 text-3xl font-extrabold"><bdi>{typeof value === "number" ? new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-EG").format(value) : value}</bdi></p>
      {sub && <p className={cn("mt-1 text-xs", accent ? "opacity-90" : "text-muted-foreground")}>{t(sub)}</p>}
    </div>
  );
}

const STATUS: Record<CampaignStatus | ApplicationStatus, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-primary/10 text-primary" },
  open: { label: "Open", cls: "bg-success/10 text-success" },
  in_progress: { label: "In progress", cls: "bg-primary/10 text-primary" },
  closed: { label: "Closed", cls: "bg-muted text-muted-foreground" },
  pending: { label: "Pending", cls: "bg-chart-5/20 text-foreground" },
  accepted: { label: "Accepted", cls: "bg-success/10 text-success" },
  rejected: { label: "Declined", cls: "bg-destructive/10 text-destructive" },
};

export function StatusBadge({ status }: { status: CampaignStatus | ApplicationStatus }) {
  const { t, language } = useI18n();
  const s = STATUS[status];
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold", s.cls)}>{t(s.label)}</span>;
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  const { t, language } = useI18n();
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-sm font-bold text-primary-foreground", className)}>
      {initials}
    </span>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: string; title: string; body?: string; action?: ReactNode }) {
  const { t, language } = useI18n();
  return (
    <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
      <div className="text-4xl">{icon}</div>
      <h3 className="mt-3 text-lg font-bold">{t(title)}</h3>
      {body && <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{t(body)}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Field({ label, children, error }: { label: string; children: ReactNode; error?: string | undefined }) {
  const { t, language } = useI18n();
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{t(label)}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{t(error)}</span>}
    </label>
  );
}

/** Blue check shown next to verified creator and brand names. */
export function VerifiedBadge({ className }: { className?: string }) {
  const { t } = useI18n();
  return <BadgeCheck className={cn("inline h-4 w-4 shrink-0 text-primary", className)} aria-label={t("Verified")} />;
}

const BADGE_ICONS: Record<BadgeIcon, typeof Crown> = { crown: Crown, star: Star, briefcase: Briefcase };

/** Achievement pill, e.g. "Top Rated" or "Active Hirer". */
export function BadgePill({ badge, suffix }: { badge: Badge; suffix?: string }) {
  const { t } = useI18n();
  const Icon = BADGE_ICONS[badge.icon];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold", badge.tone === "brand" ? "bg-primary/10 text-primary" : "bg-pink/10 text-pink")}>
      <Icon className="h-3.5 w-3.5" />
      {suffix && <bdi>{suffix}</bdi>} {t(badge.label)}
    </span>
  );
}

/** Lists how each badge is earned. */
export function BadgeCriteria() {
  const { t } = useI18n();
  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="text-sm font-bold">{t("How badges are earned")}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {BADGE_CRITERIA.map((c) => (
          <li key={c.label} className="flex gap-2"><span className="min-w-28 font-semibold">{t(c.label)}</span><span className="text-muted-foreground">{t(c.rule)}</span></li>
        ))}
      </ul>
    </div>
  );
}

export const inputCls =
  "w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-brand transition hover:opacity-90 disabled:opacity-50";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl border bg-background px-5 py-2.5 text-sm font-semibold transition hover:bg-muted";
