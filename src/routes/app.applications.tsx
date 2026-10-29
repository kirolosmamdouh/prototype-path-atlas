import { useLocalizedFormat } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n";
import { createFileRoute, Link } from "@tanstack/react-router";
import { EmptyState, PageHeader, StatusBadge, btnPrimary } from "@/components/uc/ui";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/app/applications")({
  head: () => ({ meta: [{"title": "My applications \u2014 UpCreator"}, {"name": "description", "content": "My applications in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:title", "content": "My applications \u2014 UpCreator"}, {"property": "og:description", "content": "My applications in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }), component: MyApplications });

function MyApplications() {
  const { t, language } = useI18n();
  const { ago, fmt, fmtDate, currency } = useLocalizedFormat();
  const { user, store } = useApp();
  const apps = store.applications.filter((a) => a.creatorId === user?.id);
  return (
    <>
      <PageHeader title={t("My applications")} subtitle={t("Track every proposal you've sent.")} />
      {apps.length === 0 ? (
        <EmptyState icon="📄" title={t("No proposals yet")} action={<Link to="/app/campaigns" className={btnPrimary}>{t("Browse campaigns")}</Link>} />
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
                <p className="text-sm font-bold">{currency} {fmt(a.rate)}</p>
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
