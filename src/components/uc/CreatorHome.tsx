import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Rocket, Search, Sparkles, Timer, X } from "lucide-react";
import { Avatar, VerifiedBadge } from "@/components/uc/ui";
import { useI18n, useLocalizedFormat } from "@/lib/i18n";
import { profileCompletion } from "@/lib/profile";
import { cn } from "@/lib/utils";
import type { Campaign, Store, User } from "@/lib/types";

type Tab = "best" | "recent" | "saved";
const SAVED_KEY = "uc-saved-campaigns";

/** Upwork-style "find work" home for creators: promo, job search, tabbed feed and profile sidebar. */
export function CreatorHome({ user, store }: { user: User; store: Store }) {
  const { language } = useI18n();
  const ar = language === "ar";
  const L = (en: string, a: string) => (ar ? a : en);
  const { fmt, currency, ago } = useLocalizedFormat();
  const [tab, setTab] = useState<Tab>("best");
  const [q, setQ] = useState("");
  const [promo, setPromo] = useState(true);
  const [saved, setSaved] = useState<number[]>([]);
  const [toggles, setToggles] = useState({ available: true, open: false, boost: false });

  useEffect(() => { try { setSaved(JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]")); } catch { /* ignore */ } }, []);
  const toggleSave = (id: number) => setSaved((s) => {
    const next = s.includes(id) ? s.filter((x) => x !== id) : [...s, id];
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    return next;
  });

  const applied = new Set(store.applications.filter((a) => a.creatorId === user.id).map((a) => a.campaignId));
  const pct = profileCompletion(user);

  const list = useMemo(() => {
    let l = store.campaigns.filter((c) => c.status === "open");
    const term = q.trim().toLowerCase();
    if (term) l = l.filter((c) => `${c.title} ${c.description} ${c.niche}`.toLowerCase().includes(term));
    if (tab === "saved") return l.filter((c) => saved.includes(c.id));
    if (tab === "recent") return [...l].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const fit = (c: Campaign) => (c.niche === user.niche ? 2 : 0) + (user.platforms?.some((p) => c.platform === p || c.platform === "Both") ? 1 : 0);
    return [...l].sort((a, b) => fit(b) - fit(a));
  }, [store.campaigns, q, tab, saved, user]);

  const tabs: [Tab, string][] = [["best", L("Best matches", "أفضل تطابق")], ["recent", L("Most recent", "الأحدث")], ["saved", L("Saved campaigns", "الحملات المحفوظة")]];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-5">
        <div className="relative overflow-hidden rounded-3xl bg-sidebar p-8 text-sidebar-accent-foreground sm:p-10">
          <p className="text-lg font-semibold">{L("Get hired faster", "اتعيّن أسرع")}</p>
          <h2 className="mt-3 max-w-lg text-2xl font-extrabold leading-tight sm:text-3xl">{L("Creators with a complete profile get up to 2X more brand deals", "المبدعون بملف مكتمل يحصلون على ضعف صفقات العلامات التجارية")}</h2>
          <Link to="/app/profile" className="mt-6 inline-flex rounded-full bg-background px-5 py-2.5 text-sm font-bold text-foreground">{L("Polish my profile", "حسّن ملفي")}</Link>
          <Sparkles className="absolute -bottom-6 end-6 h-40 w-40 text-sidebar-primary opacity-40" />
        </div>

        {promo && (
          <div className="flex items-center gap-3 rounded-2xl bg-accent/30 p-4 text-sm font-semibold">
            <Rocket className="h-5 w-5 shrink-0 text-primary" />
            <span className="flex-1">{L("Find campaigns faster: turn on Boost to appear first in brand searches.", "اعثر على الحملات أسرع: فعّل التعزيز لتظهر أولًا في بحث العلامات.")}</span>
            <button onClick={() => setToggles((t) => ({ ...t, boost: true }))} className="rounded-full border border-foreground/20 bg-background px-4 py-1.5">{L("Boost profile", "عزّز ملفي")}</button>
            <button onClick={() => setPromo(false)} aria-label={L("Dismiss", "إغلاق")}><X className="h-4 w-4" /></button>
          </div>
        )}

        <label className="flex items-center gap-3 rounded-full border bg-card px-5 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L("Search for campaigns", "ابحث عن حملات")} className="w-full bg-transparent text-sm outline-none" />
        </label>

        <div className="flex gap-6 overflow-x-auto border-b">
          {tabs.map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className={cn("whitespace-nowrap border-b-2 pb-3 text-sm font-semibold", tab === k ? "border-foreground" : "border-transparent text-muted-foreground")}>
              {label}{k === "saved" && saved.length > 0 && <span className="ms-1.5 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{saved.length}</span>}
            </button>
          ))}
        </div>

        {list.length === 0 && <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">{tab === "saved" ? L("No saved campaigns yet. Tap the heart on a campaign to save it.", "لا توجد حملات محفوظة. اضغط على القلب لحفظ حملة.") : L("No campaigns match your search.", "لا توجد حملات مطابقة.")}</p>}

        {list.map((c) => {
          const brand = store.users.find((u) => u.id === c.userId);
          const proposals = store.applications.filter((a) => a.campaignId === c.id).length;
          const done = applied.has(c.id);
          return (
            <article key={c.id} className="rounded-3xl border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {L("Posted", "نُشرت")} {ago(c.createdAt)} · {L("Proposals", "العروض")}: <bdi>{fmt(proposals)}</bdi>
                  </span>
                  <Link to="/app/campaigns/$id" params={{ id: String(c.id) }} className="mt-3 block text-xl font-semibold hover:text-primary">{c.title}</Link>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-success/10 p-1 ps-3">
                  <button onClick={() => toggleSave(c.id)} aria-label={L("Save campaign", "احفظ الحملة")}>
                    <Heart className={cn("h-5 w-5", saved.includes(c.id) ? "fill-pink text-pink" : "text-muted-foreground")} />
                  </button>
                  <span className="flex items-center gap-1 text-sm font-semibold"><Timer className="h-4 w-4" />{L("Hiring now", "توظّف الآن")}</span>
                  {done
                    ? <span className="rounded-full bg-muted px-4 py-2 text-sm font-bold text-muted-foreground">{L("Applied", "تم التقديم")}</span>
                    : <Link to="/app/campaigns/$id" params={{ id: String(c.id) }} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">{L("Apply now", "قدّم الآن")}</Link>}
                </div>
              </div>
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>{L("Budget", "الميزانية")}: <bdi>{currency} {fmt(c.budget)}</bdi></span>
                <span>{c.platform}</span>
                <span>{c.deliverables}</span>
              </p>
              <p className="mt-3 line-clamp-3 text-sm">{c.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[c.niche, c.platform, "UGC"].map((s) => <span key={s} className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold">{s}</span>)}
              </div>
              <p className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {brand?.verified && <span className="flex items-center gap-1"><VerifiedBadge /> {L("Verified brand", "علامة موثقة")}</span>}
                <span>{brand?.company ?? brand?.name}</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{brand?.location ?? L("Egypt", "مصر")}</span>
              </p>
            </article>
          );
        })}
      </div>

      <aside className="space-y-5">
        <div className="rounded-3xl bg-muted p-6">
          <div className="flex items-center gap-4">
            <span className="relative"><Avatar name={user.name} className="h-16 w-16 rounded-full text-lg" />
              {toggles.available && <span className="absolute bottom-0 end-0 h-4 w-4 rounded-full border-2 border-muted bg-success" />}</span>
            <div className="min-w-0">
              <p className="flex items-center gap-1 text-lg font-bold">{user.name} {user.verified && <VerifiedBadge />}</p>
              <p className="truncate text-sm text-muted-foreground">{user.niche ?? L("Creator", "مبدع")}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-between text-sm"><span className="font-semibold">{L("Profile visibility", "ظهور الملف")}</span><span className="font-semibold text-success">{L("Public", "عام")}</span></div>
          <Link to="/app/profile" className="mt-5 block text-sm font-bold text-primary">{L("Complete your profile", "أكمل ملفك")}</Link>
          <div className="mt-3 flex items-center gap-3"><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-background"><span className="block h-full bg-foreground" style={{ width: `${pct}%` }} /></span><bdi className="text-xs font-bold">{pct}% {L("complete", "مكتمل")}</bdi></div>
        </div>

        <div className="rounded-3xl bg-muted p-6">
          <h3 className="text-lg font-bold">{L("Reach more brands", "صل لعلامات أكثر")}</h3>
          {([["available", L("Available now", "متاح الآن")], ["open", L("Open to long-term deals", "منفتح لصفقات طويلة")], ["boost", L("Boost your profile", "عزّز ملفك")]] as const).map(([k, label]) => (
            <div key={k} className="mt-4 flex items-center justify-between text-sm">
              <span className="font-medium">{label}</span>
              <button role="switch" aria-checked={toggles[k]} onClick={() => setToggles((t) => ({ ...t, [k]: !t[k] }))}
                className={cn("rounded-md px-3 py-1 text-xs font-bold", toggles[k] ? "bg-success/20 text-success" : "bg-background text-muted-foreground")}>
                {toggles[k] ? L("On", "مفعّل") : L("Off", "متوقف")}
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-muted p-6">
          <p className="text-lg font-bold">{L("Proposals sent", "العروض المرسلة")}: <bdi>{fmt(applied.size)}</bdi></p>
          <div className="mt-3 flex gap-4 text-sm font-bold text-primary">
            <Link to="/app/applications">{L("View proposals", "عرض العروض")}</Link>
            <Link to="/app/earnings">{L("Earnings", "الأرباح")}</Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
