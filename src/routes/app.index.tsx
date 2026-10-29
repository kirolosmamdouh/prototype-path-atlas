import { createFileRoute, Link } from "@tanstack/react-router";
import { CampaignCard } from "@/components/uc/CampaignCard";
import { Avatar, EmptyState, PageHeader, StatCard, StatusBadge, btnPrimary } from "@/components/uc/ui";
import { ago, fmt, useApp } from "@/lib/store";
import type { Store, User } from "@/lib/types";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const { user, store } = useApp();
  if (!user) return null;
  return user.role === "brand" ? <BrandDashboard user={user} store={store} /> : <CreatorDashboard user={user} store={store} />;
}

function BrandDashboard({ user, store }: { user: User; store: Store }) {
  const mine = store.campaigns.filter((c) => c.userId === user.id);
  const apps = store.applications.filter((a) => mine.some((c) => c.id === a.campaignId));
  const pending = apps.filter((a) => a.status === "pending");
  const spend = apps.filter((a) => a.status === "accepted").reduce((s, a) => s + a.rate, 0);

  return (
    <>
      <PageHeader title={`Hi, ${user.name} 👋`} subtitle="Here's what's happening with your campaigns."
        action={<Link to="/app/campaigns/new" className={btnPrimary}>＋ Post a campaign</Link>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard accent label="Active campaigns" value={mine.filter((c) => c.status !== "closed").length} />
        <StatCard label="Total proposals" value={apps.length} />
        <StatCard label="Awaiting review" value={pending.length} />
        <StatCard label="Committed spend" value={`EGP ${fmt(spend)}`} />
      </div>
      <h2 className="mb-4 mt-10 text-lg font-bold">New proposals</h2>
      {pending.length === 0 ? (
        <EmptyState icon="📭" title="No proposals waiting" body="New proposals from creators will show up here." />
      ) : (
        <div className="divide-y rounded-2xl border bg-card">
          {pending.map((a) => {
            const c = store.users.find((u) => u.id === a.creatorId);
            const camp = mine.find((x) => x.id === a.campaignId);
            return (
              <div key={a.id} className="flex items-center gap-4 p-4">
                <Avatar name={c?.name ?? "?"} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{c?.name} <span className="font-normal text-muted-foreground">→ {camp?.title}</span></p>
                  <p className="truncate text-sm text-muted-foreground">{a.pitch}</p>
                </div>
                <p className="text-sm font-bold">EGP {fmt(a.rate)}</p>
                <span className="text-xs text-muted-foreground">{ago(a.createdAt)}</span>
              </div>
            );
          })}
        </div>
      )}
      <h2 className="mb-4 mt-10 text-lg font-bold">Your campaigns</h2>
      <div className="grid gap-4 md:grid-cols-2">{mine.map((c) => <CampaignCard key={c.id} campaign={c} store={store} />)}</div>
    </>
  );
}

function CreatorDashboard({ user, store }: { user: User; store: Store }) {
  const apps = store.applications.filter((a) => a.creatorId === user.id);
  const earned = apps.filter((a) => a.status === "accepted").reduce((s, a) => s + a.rate, 0);
  const applied = new Set(apps.map((a) => a.campaignId));
  const recommended = store.campaigns.filter((c) => c.status === "open" && !applied.has(c.id)).slice(0, 4);

  return (
    <>
      <PageHeader title={`Welcome, ${user.name.split(" ")[0]} ✨`} subtitle="Find your next brand deal."
        action={<Link to="/app/campaigns" className={btnPrimary}>Browse campaigns</Link>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard accent label="Earnings" value={`EGP ${fmt(earned)}`} sub="From accepted deals" />
        <StatCard label="Proposals sent" value={apps.length} />
        <StatCard label="Accepted" value={apps.filter((a) => a.status === "accepted").length} />
        <StatCard label="Pending" value={apps.filter((a) => a.status === "pending").length} />
      </div>
      <h2 className="mb-4 mt-10 text-lg font-bold">Recommended for you</h2>
      {recommended.length ? (
        <div className="grid gap-4 md:grid-cols-2">{recommended.map((c) => <CampaignCard key={c.id} campaign={c} store={store} />)}</div>
      ) : (
        <EmptyState icon="🎉" title="You've applied to everything open" body="Check back soon for new campaigns." />
      )}
      <h2 className="mb-4 mt-10 text-lg font-bold">Recent proposals</h2>
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
