import { useLocalizedFormat } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CampaignCard } from "@/components/uc/CampaignCard";
import { CreatorHome } from "@/components/uc/CreatorHome";
import { BrandOverview } from "@/components/uc/BrandOverview";
import { Avatar, EmptyState, PageHeader, StatCard, StatusBadge, btnPrimary } from "@/components/uc/ui";
import { useApp } from "@/lib/store";
import type { Store, User } from "@/lib/types";
import { profileCompletion } from "@/lib/profile";

function ProfileNudge({ user }: { user: User }) {
  const { t } = useI18n();
  const pct = profileCompletion(user);
  if (pct >= 100) return null;
  return (
    <Link to="/app/profile" className="mb-6 flex items-center justify-between gap-4 rounded-2xl border bg-card p-4 hover:bg-muted">
      <span className="text-sm font-semibold">{t("Complete your profile")}</span>
      <span className="flex items-center gap-3"><span className="h-2 w-32 overflow-hidden rounded-full bg-muted"><span className="block h-full bg-primary" style={{ width: `${pct}%` }} /></span><bdi className="text-xs font-bold">{pct}%</bdi></span>
    </Link>
  );
}

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{"title": "Dashboard \u2014 UpCreator"}, {"name": "description", "content": "Dashboard in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:title", "content": "Dashboard \u2014 UpCreator"}, {"property": "og:description", "content": "Dashboard in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Dashboard,
});

function Dashboard() {
  const { t, language } = useI18n();
  const { ago, fmt, fmtDate, currency } = useLocalizedFormat();
  const { user, store } = useApp();
  if (!user) return null;
  return user.role === "brand" ? <BrandDashboard user={user} store={store} /> : <CreatorDashboard user={user} store={store} />;
}

function BrandDashboard({ user, store }: { user: User; store: Store }) {
  const { t, language } = useI18n();
  const { ago, fmt, fmtDate, currency } = useLocalizedFormat();
  const mine = store.campaigns;
  const apps = store.applications.filter((a) => mine.some((c) => c.id === a.campaignId));
  const pending = apps.filter((a) => a.status === "pending");
  const spend = apps.filter((a) => a.status === "accepted").reduce((s, a) => s + a.rate, 0);

  return (
    <>
      <PageHeader title={`${t("Welcome back,")} ${user.name}`} subtitle={t("Here's what's happening with your campaigns.")}
        action={<Link to="/app/campaigns/new" className={btnPrimary}>{t("\uff0b Post a campaign")}</Link>} />
      <ProfileNudge user={user} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard accent label={t("Active campaigns")} value={mine.filter((c) => c.status !== "closed").length} />
        <StatCard label={t("Total proposals")} value={apps.length} />
        <StatCard label={t("Awaiting review")} value={pending.length} />
        <StatCard label={t("Committed spend")} value={`${currency} ${fmt(spend)}`} />
      </div>
      <div className="mt-10"><BrandOverview user={user} store={store} /></div>
    </>
  );
}

function CreatorDashboard({ user, store }: { user: User; store: Store }) {
  return <CreatorHome user={user} store={store} />;
}
