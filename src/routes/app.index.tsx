import { useLocalizedFormat } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CampaignCard } from "@/components/uc/CampaignCard";
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
  const mine = store.campaigns.filter((c) => c.userId === user.id);
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
  const { t, language } = useI18n();
  const { ago, fmt, fmtDate, currency } = useLocalizedFormat();
  const apps = store.applications.filter((a) => a.creatorId === user.id);
  const earned = apps.filter((a) => a.status === "accepted").reduce((s, a) => s + a.rate, 0);
  const applied = new Set(apps.map((a) => a.campaignId));
  const recommended = store.campaigns.filter((c) => c.status === "open" && !applied.has(c.id)).slice(0, 4);

  return (
    <>
      <PageHeader title={`${language === "ar" ? "مرحبًا،" : "Welcome,"} ${user.name.split(" ")[0]} ✨`} subtitle={t("Find your next brand deal.")}
        action={<Link to="/app/campaigns" className={btnPrimary}>{t("Browse campaigns")}</Link>} />
      <ProfileNudge user={user} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard accent label={t("Earnings")} value={`${currency} ${fmt(earned)}`} sub="From accepted deals" />
        <StatCard label={t("Proposals sent")} value={apps.length} />
        <StatCard label={t("Accepted")} value={apps.filter((a) => a.status === "accepted").length} />
        <StatCard label={t("Pending")} value={apps.filter((a) => a.status === "pending").length} />
      </div>
      <h2 className="mb-4 mt-10 text-lg font-bold">{t("Recommended for you")}</h2>
      {recommended.length ? (
        <div className="grid gap-4 md:grid-cols-2">{recommended.map((c) => <CampaignCard key={c.id} campaign={c} store={store} />)}</div>
      ) : (
        <EmptyState icon="🎉" title={t("You've applied to everything open")} body={t("Check back soon for new campaigns.")} />
      )}
      <h2 className="mb-4 mt-10 text-lg font-bold">{t("Recent proposals")}</h2>
      <div className="divide-y rounded-2xl border bg-card">
        {apps.map((a) => {
          const c = store.campaigns.find((x) => x.id === a.campaignId);
          return (
            <div key={a.id} className="flex items-center justify-between gap-4 p-4">
              <p className="font-semibold">{c?.title}</p>
              <StatusBadge status={a.status} />
            </div>
          );
        })}
      </div>
    </>
  );
}
