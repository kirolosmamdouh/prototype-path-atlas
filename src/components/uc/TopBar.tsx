import { Link } from "@tanstack/react-router";
import { Bell, MessageSquare, Search } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { EMPTY_CREATOR_SEARCH, PLATFORM_OPTIONS, creatorNiches, searchCreators } from "@/lib/match";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { VerifiedBadge } from "@/components/uc/ui";
import { BADGE_CRITERIA, EMPTY_BADGE_FILTERS, filterByBadges, type BadgeFilters } from "@/lib/badges";

const chip = (active: boolean) =>
  cn("rounded-full px-2.5 py-0.5 text-xs font-bold transition", active ? "bg-primary text-primary-foreground" : "bg-muted hover:opacity-80");

export function TopBar() {
  const { t } = useI18n();
  const { user, store } = useApp();
  const [q, setQ] = useState("");
  const [niche, setNiche] = useState(EMPTY_CREATOR_SEARCH.niche);
  const [platform, setPlatform] = useState(EMPTY_CREATOR_SEARCH.platform);
  const [badges, setBadges] = useState<BadgeFilters>(EMPTY_BADGE_FILTERS);
  if (!user) return null;

  const term = q.trim().toLowerCase();
  const isBrand = user.role === "brand";
  const campaigns = term ? store.campaigns.filter((c) => (isBrand ? c.userId === user.id : c.status === "open") && c.title.toLowerCase().includes(term)).slice(0, 5) : [];
  const creators = term && isBrand ? filterByBadges(searchCreators(store.users, { q, niche, platform }), store, badges).slice(0, 5) : [];
  const niches = isBrand ? creatorNiches(store.users) : [];
  const unread = store.messages.filter((m) => m.receiverId === user.id && !m.isRead).length;
  const notifs = store.notifications.filter((n) => n.userId === user.id && !n.read).length;
  const dot = (n: number) => n > 0 && <span className="absolute -end-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-pink px-1 text-[10px] font-bold text-pink-foreground">{n}</span>;
  const reset = () => { setQ(""); setNiche(EMPTY_CREATOR_SEARCH.niche); setPlatform(EMPTY_CREATOR_SEARCH.platform); setBadges(EMPTY_BADGE_FILTERS); };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 sm:w-80 sm:flex-none">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => setTimeout(reset, 150)}
          placeholder={t("Search campaigns and creators…")} aria-label={t("Search campaigns and creators…")}
          className="w-full rounded-full border bg-background py-2 pe-4 ps-9 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        {term && (
          <div className="absolute inset-x-0 top-full z-50 mt-2 rounded-2xl border bg-popover p-2 text-popover-foreground shadow-lg">
            {isBrand && (
              <div className="space-y-2 border-b px-3 pb-3 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">{t("Niche")}:</span>
                  {["All", ...niches].map((n) => (
                    <button key={n} type="button" aria-pressed={niche === n} onMouseDown={(e) => e.preventDefault()} onClick={() => setNiche(n)} className={chip(niche === n)}>{t(n)}</button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">{t("Platform")}:</span>
                  {PLATFORM_OPTIONS.map((p) => (
                    <button key={p} type="button" aria-pressed={platform === p} onMouseDown={(e) => e.preventDefault()} onClick={() => setPlatform(p)} className={chip(platform === p)}>{t(p)}</button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">{t("Badges")}:</span>
                  {([["verified", "Verified"], ["topRated", "Top Rated"], ["jobSuccess", "Job Success"]] as const).map(([k, label]) => (
                    <button key={k} type="button" aria-pressed={badges[k]} title={t(BADGE_CRITERIA.find((c) => c.label === label)!.rule)}
                      onMouseDown={(e) => e.preventDefault()} onClick={() => setBadges((b) => ({ ...b, [k]: !b[k] }))} className={chip(badges[k])}>{t(label)}</button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground">{t("Top Rated: 100k+ followers · Job Success: 90%+ proposals accepted")}</p>
              </div>
            )}
            {!campaigns.length && !creators.length && <p className="p-3 text-sm text-muted-foreground">{t("No results")}</p>}
            {!!campaigns.length && <p className="px-3 pt-2 text-xs font-bold uppercase text-muted-foreground">{t("Campaigns")}</p>}
            {campaigns.map((c) => (
              <Link key={c.id} to="/app/campaigns/$id" params={{ id: String(c.id) }} className="block rounded-lg px-3 py-2 text-sm hover:bg-muted">{c.title}</Link>
            ))}
            {!!creators.length && <p className="px-3 pt-2 text-xs font-bold uppercase text-muted-foreground">{t("Creators")}</p>}
            {creators.map((u) => (
              <Link key={u.id} to="/app/creators/$id" params={{ id: String(u.id) }} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm hover:bg-muted">{u.name} {u.verified && <VerifiedBadge />} <span className="text-muted-foreground">· {t(u.niche ?? "")}</span></Link>
            ))}
          </div>
        )}
      </div>
      <Link to="/app/notifications" aria-label={t("Notifications")} className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted"><Bell className="h-5 w-5" />{dot(notifs)}</Link>
      <Link to="/app/messages" aria-label={t("Messages")} className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted"><MessageSquare className="h-5 w-5" />{dot(unread)}</Link>
    </div>
  );
}
