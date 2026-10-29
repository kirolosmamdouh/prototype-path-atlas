import { useLocalizedFormat } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";
import { Avatar, EmptyState, PageHeader } from "@/components/uc/ui";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/app/messages")({
  head: () => ({ meta: [{"title": "Messages \u2014 UpCreator"}, {"name": "description", "content": "Messages in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:title", "content": "Messages \u2014 UpCreator"}, {"property": "og:description", "content": "Messages in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }), component: Messages });

function Messages() {
  const { t, language } = useI18n();
  const { ago, fmt, fmtDate, currency } = useLocalizedFormat();
  const { user, store } = useApp();
  const msgs = store.messages.filter((m) => m.receiverId === user?.id || m.senderId === user?.id);
  return (
    <>
      <PageHeader title={t("Messages")} subtitle={t("Full chat threads arrive in the next phase.")} />
      {msgs.length === 0 ? <EmptyState icon="💬" title={t("No messages yet")} /> : (
        <div className="divide-y rounded-2xl border bg-card">
          {msgs.map((m) => {
            const otherId = m.senderId === user?.id ? m.receiverId : m.senderId;
            const other = store.users.find((u) => u.id === otherId);
            return (
              <div key={m.id} className="flex items-center gap-4 p-4">
                <Avatar name={other?.name ?? "?"} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{other?.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{m.body}</p>
                </div>
                {!m.isRead && m.receiverId === user?.id && <span className="h-2.5 w-2.5 rounded-full bg-pink" />}
                <span className="text-xs text-muted-foreground">{ago(m.createdAt)}</span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
