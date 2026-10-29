import { createFileRoute, Link } from "@tanstack/react-router";
import { EmptyState, PageHeader, StatusBadge, btnPrimary } from "@/components/uc/ui";
import { ago, fmt, useApp } from "@/lib/store";

export const Route = createFileRoute("/app/applications")({ component: MyApplications });

function MyApplications() {
  const { user, store } = useApp();
  const apps = store.applications.filter((a) => a.creatorId === user?.id);
  return (
    <>
      <PageHeader title="My applications" subtitle="Track every proposal you've sent." />
      {apps.length === 0 ? (
        <EmptyState icon="📄" title="No proposals yet" action={<Link to="/app/campaigns" className={btnPrimary}>Browse campaigns</Link>} />
      ) : (
        <div className="space-y-3">
          {apps.map((a) => {
            const c = store.campaigns.find((x) => x.id === a.campaignId);
            return (
              <Link key={a.id} to="/app/campaigns/$id" params={{ id: String(a.campaignId) }} className="flex items-center gap-4 rounded-2xl border bg-card p-5 hover:border-primary/40">
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{c?.title}</p>
                  <p className="truncate text-sm text-muted-foreground">{a.pitch}</p>
                </div>
                <p className="text-sm font-bold">EGP {fmt(a.rate)}</p>
                <StatusBadge status={a.status} />
                <span className="text-xs text-muted-foreground">{ago(a.createdAt)}</span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
