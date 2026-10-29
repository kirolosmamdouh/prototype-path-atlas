import { Link } from "@tanstack/react-router";
import { Bell, MessageSquare, Search } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useApp } from "@/lib/store";

export function TopBar() {
  const { t } = useI18n();
  const { user, store } = useApp();
  const [q, setQ] = useState("");
  if (!user) return null;
  const term = q.trim().toLowerCase();
  const campaigns = term ? store.campaigns.filter((c) => (user.role === "brand" ? c.userId === user.id : c.status === "open") && c.title.toLowerCase().includes(term)).slice(0, 5) : [];
  const creators = term && user.role === "brand" ? store.users.filter((u) => u.role === "creator" && u.name.toLowerCase().includes(term)).slice(0, 5) : [];
  const unread = store.messages.filter((m) => m.receiverId === user.id && !m.isRead).length;
  const notifs = store.notifications.filter((n) => n.userId === user.id && !n.read).length;
  const dot = (n: number) => n > 0 && <span className="absolute -end-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-pink px-1 text-[10px] font-bold text-pink-foreground">{n}</span>;

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 sm:w-80 sm:flex-none">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => setTimeout(() => setQ(""), 150)}
          placeholder={t("Search campaigns and creators…")} aria-label={t("Search campaigns and creators…")}
          className="w-full rounded-full border bg-background py-2 pe-4 ps-9 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        {term && (
          <div className="absolute inset-x-0 top-full z-50 mt-2 rounded-2xl border bg-popover p-2 text-popover-foreground shadow-lg">
            {!campaigns.length && !creators.length && <p className="p-3 text-sm text-muted-foreground">{t("No results")}</p>}
            {!!campaigns.length && <p className="px-3 pt-2 text-xs font-bold uppercase text-muted-foreground">{t("Campaigns")}</p>}
            {campaigns.map((c) => (
              <Link key={c.id} to="/app/campaigns/$id" params={{ id: String(c.id) }} className="block rounded-lg px-3 py-2 text-sm hover:bg-muted">{c.title}</Link>
            ))}
            {!!creators.length && <p className="px-3 pt-2 text-xs font-bold uppercase text-muted-foreground">{t("Creators")}</p>}
            {creators.map((u) => (
              <Link key={u.id} to="/app/ai-match" className="block rounded-lg px-3 py-2 text-sm hover:bg-muted">{u.name} · {t(u.niche ?? "")}</Link>
            ))}
          </div>
        )}
      </div>
      <Link to="/app/notifications" aria-label={t("Notifications")} className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted"><Bell className="h-5 w-5" />{dot(notifs)}</Link>
      <Link to="/app/messages" aria-label={t("Messages")} className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted"><MessageSquare className="h-5 w-5" />{dot(unread)}</Link>
    </div>
  );
}
