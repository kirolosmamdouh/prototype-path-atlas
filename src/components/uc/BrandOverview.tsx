import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Heart, Lightbulb, Megaphone, MessageSquare, Plus } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { useI18n, useLocalizedFormat } from "@/lib/i18n";
import { pastCollaborators, personalizedCreators } from "@/lib/match";
import type { Store, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, StatusBadge, VerifiedBadge } from "./ui";

const outlineBtn = "inline-flex flex-1 items-center justify-center rounded-full border-2 border-primary px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary/5";
const iconBtn = "grid h-10 w-10 shrink-0 place-items-center rounded-full border bg-background text-foreground transition hover:bg-muted";
const card = "flex w-[280px] shrink-0 snap-start flex-col rounded-3xl border bg-card p-6 sm:w-[300px]";

function Carousel({ children }: { children: ReactNode }) {
  const { t, language } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (language === "ar" ? -1 : 1) * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const arrow = "absolute top-1/2 z-10 hidden -translate-y-1/2 h-11 w-11 place-items-center rounded-full border bg-background shadow-sm transition hover:bg-muted md:grid";
  return (
    <div className="relative">
      <button type="button" aria-label={t("Previous")} onClick={() => go(-1)} className={cn(arrow, "-start-5")}><ArrowLeft className="h-5 w-5 rtl:rotate-180" /></button>
      <div ref={ref} className="flex snap-x gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none]">{children}</div>
      <button type="button" aria-label={t("Next")} onClick={() => go(1)} className={cn(arrow, "-end-5")}><ArrowRight className="h-5 w-5 rtl:rotate-180" /></button>
    </div>
  );
}

function SectionTitle({ title, to, link }: { title: string; to: "/app/talent" | "/app/manage" | "/app/ai-match"; link: string }) {
  const { t } = useI18n();
  return (
    <div className="mb-4 mt-12 flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-2xl font-extrabold tracking-tight">{t(title)}</h2>
      <Link to={to} className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
        {t(link)} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
      </Link>
    </div>
  );
}

export function BrandOverview({ user, store }: { user: User; store: Store }) {
  const { t } = useI18n();
  const { fmt, currency } = useLocalizedFormat();
  const [view, setView] = useState<"grid" | "list">("grid");
  const mine = store.campaigns.filter((c) => c.userId === user.id && c.status !== "closed")
    .sort((a, b) => (a.status === "draft" ? -1 : 0) - (b.status === "draft" ? -1 : 0) || b.createdAt.localeCompare(a.createdAt));
  const talent = personalizedCreators(user.id, store);
  const past = pastCollaborators(user.id, store);
  const proposals = (id: number) => store.applications.filter((a) => a.campaignId === id).length;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-extrabold tracking-tight">{t("Overview")}</h2>
        <div className="flex rounded-full bg-muted p-1">
          {(["grid", "list"] as const).map((v) => (
            <button key={v} type="button" onClick={() => setView(v)} aria-label={t(v === "grid" ? "Grid view" : "List view")}
              className={cn("rounded-full px-5 py-1.5 text-sm font-bold transition", view === v ? "bg-background shadow-sm" : "text-muted-foreground")}>
              {v === "grid" ? "▦" : "☰"}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <Carousel>
          {mine.map((c) => (
            <div key={c.id} className={cn(card, "min-h-[300px]")}>
              <div className="flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"><Megaphone className="h-5 w-5" /></span>
                <p className="line-clamp-2 text-sm font-semibold">{c.title}</p>
              </div>
              <div className="mt-5"><StatusBadge status={c.status} /></div>
              {c.status === "draft" ? (
                <>
                  <h3 className="mt-3 text-xl font-bold">{t("Add details to your draft")}</h3>
                  <Link to="/app/campaigns/new" className={cn(outlineBtn, "mt-auto flex-none")}>{t("Fill in draft")}</Link>
                </>
              ) : (
                <>
                  <p className="mt-3 text-2xl font-extrabold">{currency} {fmt(c.budget)}</p>
                  <p className="text-sm text-muted-foreground">{proposals(c.id)} {t("Proposals")}</p>
                  <Link to="/app/campaigns/$id" params={{ id: String(c.id) }} className={cn(outlineBtn, "mt-auto flex-none")}>{t("View campaign")}</Link>
                </>
              )}
            </div>
          ))}
          <Link to="/app/campaigns/new" className="flex min-h-[300px] min-w-[280px] flex-1 snap-start items-center justify-center gap-2 rounded-3xl border bg-card text-lg font-semibold transition hover:border-primary/40">
            <Plus className="h-5 w-5" /> {t("Post a campaign")}
          </Link>
        </Carousel>
      ) : (
        <div className="divide-y rounded-2xl border bg-card">
          {mine.map((c) => (
            <Link key={c.id} to={c.status === "draft" ? "/app/campaigns/new" : "/app/campaigns/$id"} params={{ id: String(c.id) }}
              className="flex items-center justify-between gap-4 p-4 hover:bg-muted/50">
              <span className="font-semibold">{c.title}</span>
              <StatusBadge status={c.status} />
            </Link>
          ))}
        </div>
      )}

      <SectionTitle title="Personalized creators" to="/app/ai-match" link="Browse creators" />
      {talent.length === 0 ? (
        <p className="rounded-3xl border bg-card p-8 text-center text-muted-foreground">{t("Post a campaign to get creator recommendations.")}</p>
      ) : (
        <Carousel>
          {talent.map(({ creator: cr, score, campaign }) => (
            <div key={cr.id} className={cn(card, "min-h-[320px]")}>
              <div className="flex items-start gap-3">
                <Avatar name={cr.name} className="h-12 w-12 rounded-full" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-lg font-bold">{cr.name} {cr.verified && <VerifiedBadge />}</p>
                  <p className="text-sm text-muted-foreground">{t(cr.location ?? "Egypt")}</p>
                </div>
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 grid grid-cols-2 text-center">
                <div><p className="font-bold">{score}%</p><p className="text-xs text-muted-foreground">{t("Match")}</p></div>
                <div><p className="font-bold">{cr.rate ? `${currency} ${fmt(cr.rate)}` : "—"}</p><p className="text-xs text-muted-foreground">{t("Rate")}</p></div>
              </div>
              <p className="mt-4 line-clamp-2 text-sm">{cr.bio}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[cr.niche, ...(cr.platforms ?? [])].filter(Boolean).map((tag) => (
                  <span key={tag} className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold">{t(tag!)}</span>
                ))}
              </div>
              <div className="mt-auto flex gap-2 pt-5">
                <Link to="/app/campaigns/$id" params={{ id: String(campaign.id) }} className={outlineBtn}>{t("Invite to campaign")}</Link>
                <Link to="/app/messages" className={iconBtn} aria-label={t("Messages")}><MessageSquare className="h-4 w-4" /></Link>
              </div>
            </div>
          ))}
        </Carousel>
      )}

      <SectionTitle title="Work together again on something new" to="/app/manage" link="Browse past collaborators" />
      <Carousel>
        {past.map(({ creator: cr, jobs, lastCampaign }) => (
          <div key={cr.id} className={cn(card, "min-h-[300px]")}>
            <div className="flex items-start gap-3">
              <Avatar name={cr.name} className="h-12 w-12 rounded-full" />
              <div><p className="flex items-center gap-1.5 text-lg font-bold">{cr.name} {cr.verified && <VerifiedBadge />}</p><p className="text-sm text-muted-foreground">{t(cr.location ?? "Egypt")}</p></div>
            </div>
            <div className="mt-4 grid grid-cols-2 text-center">
              <div><p className="font-bold">{fmt(jobs)}</p><p className="text-xs text-muted-foreground">{t("Jobs")}</p></div>
              <div><p className="font-bold">{cr.rate ? `${currency} ${fmt(cr.rate)}` : "—"}</p><p className="text-xs text-muted-foreground">{t("Rate")}</p></div>
            </div>
            <p className="mt-4 text-sm">{t("Last campaign together:")}</p>
            <p className="text-sm font-semibold">{lastCampaign.title}</p>
            <div className="mt-auto flex gap-2 pt-5">
              <Link to="/app/campaigns/new" className={outlineBtn}>{t("Rehire")}</Link>
              <Link to="/app/messages" className={iconBtn} aria-label={t("Messages")}><MessageSquare className="h-4 w-4" /></Link>
            </div>
          </div>
        ))}
        <div className="flex min-h-[300px] min-w-[280px] flex-1 snap-start flex-col items-center justify-center rounded-3xl bg-card/60 p-8 text-center text-muted-foreground">
          <Lightbulb className="h-7 w-7 text-foreground" />
          <p className="mt-3 text-lg font-bold text-foreground">{t("Did you know?")}</p>
          <p className="mt-2 max-w-sm text-sm">{t("You can run several campaigns with the same creator.")}</p>
          <p className="mt-2 max-w-sm text-sm">{t("Rehire creators you already trust to kickstart new work.")}</p>
        </div>
      </Carousel>
    </>
  );
}
