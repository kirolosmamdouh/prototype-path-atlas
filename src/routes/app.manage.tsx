import { useLocalizedFormat } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n";
import { createFileRoute, Link } from "@tanstack/react-router";
import { EmptyState, PageHeader, StatusBadge, btnPrimary } from "@/components/uc/ui";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/app/manage")({ component: Manage });

function Manage() {
  const { t, language } = useI18n();
  const { ago, fmt, fmtDate, currency } = useLocalizedFormat();
  const { user, store } = useApp();
  const mine = store.campaigns.filter((c) => c.userId === user?.id);
  return (
    <>
      <PageHeader title={t("Manage work")} subtitle={t("All your campaigns and their proposals.")}
        action={<Link to="/app/campaigns/new" className={btnPrimary}>{t("\uff0b New campaign")}</Link>} />
      {mine.length === 0 ? <EmptyState icon="📋" title={t("No campaigns yet")} /> : (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-start text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="p-4">{t("Campaign")}</th><th>{t("Status")}</th><th>{t("Budget")}</th><th>{t("Proposals")}</th><th>{t("Deadline")}</th></tr>
            </thead>
            <tbody className="divide-y">
              {mine.map((c) => (
                <tr key={c.id}>
                  <td className="p-4 font-bold"><Link to="/app/campaigns/$id" params={{ id: String(c.id) }} className="hover:text-primary">{c.title}</Link></td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>{currency} {fmt(c.budget)}</td>
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
