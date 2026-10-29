import { Button } from "@/components/ui/button";
import { useLocalizedFormat } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";
import { EmptyState, PageHeader, btnGhost } from "@/components/uc/ui";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({ meta: [{"title": "Notifications \u2014 UpCreator"}, {"name": "description", "content": "Notifications in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:title", "content": "Notifications \u2014 UpCreator"}, {"property": "og:description", "content": "Notifications in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }), component: Notifications });

function Notifications() {
  const { t, language } = useI18n();
  const { ago, fmt, fmtDate, currency } = useLocalizedFormat();
  const { user, store, update } = useApp();
  const list = store.notifications.filter((n) => n.userId === user?.id);
  const markAll = () =>
    update((s) => ({ notifications: s.notifications.map((n) => (n.userId === user?.id ? { ...n, read: true } : n)) }));
  return (
    <>
      <PageHeader title={t("Notifications")} action={<Button variant="ghost" onClick={markAll} className={btnGhost}>{t("Mark all as read")}</Button>} />
      {list.length === 0 ? <EmptyState icon="🔔" title={t("You're all caught up")} /> : (
        <div className="space-y-3">
          {list.map((n) => (
            <div key={n.id} className={cn("rounded-2xl border bg-card p-5", !n.read && "border-primary/40 bg-secondary")}>
              <div className="flex justify-between"><p className="font-bold">{n.title}</p><span className="text-xs text-muted-foreground">{ago(n.createdAt)}</span></div>
              <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
