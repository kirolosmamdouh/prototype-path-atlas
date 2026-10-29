import { createFileRoute, Link } from "@tanstack/react-router";
import { EmptyState, PageHeader, StatusBadge, btnPrimary } from "@/components/uc/ui";
import { fmt, fmtDate, useApp } from "@/lib/store";

export const Route = createFileRoute("/app/manage")({ component: Manage });

function Manage() {
  const { user, store } = useApp();
  const mine = store.campaigns.filter((c) => c.userId === user?.id);
  return (
    <>
      <PageHeader title="Manage work" subtitle="All your campaigns and their proposals."
        action={<Link to="/app/campaigns/new" className={btnPrimary}>＋ New campaign</Link>} />
      {mine.length === 0 ? <EmptyState icon="📋" title="No campaigns yet" /> : (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="p-4">Campaign</th><th>Status</th><th>Budget</th><th>Proposals</th><th>Deadline</th></tr>
            </thead>
            <tbody className="divide-y">
              {mine.map((c) => (
                <tr key={c.id}>
                  <td className="p-4 font-bold"><Link to="/app/campaigns/$id" params={{ id: String(c.id) }} className="hover:text-primary">{c.title}</Link></td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>EGP {fmt(c.budget)}</td>
                  <td>{store.applications.filter((a) => a.campaignId === c.id).length}</td>
                  <td>{fmtDate(c.deadline)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
