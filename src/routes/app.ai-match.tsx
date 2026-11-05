import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { Avatar, BadgePill, EmptyState, Field, PageHeader, VerifiedBadge, btnGhost, btnPrimary, inputCls } from "@/components/uc/ui";
import { useI18n, useLocalizedFormat } from "@/lib/i18n";
import { creatorBadges } from "@/lib/badges";
import {
  EMPTY_FILTERS,
  PLATFORM_OPTIONS,
  creatorNiches,
  filterMatches,
  isFiltered,
  matchCreators,
  rateCeiling,
  sortMatches,
  type MatchFilters,
  type MatchSort,
} from "@/lib/match";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/ai-match")({
  head: () => ({ meta: [{ title: "AI Creator Match — UpCreator" }, { name: "description", content: "Find the Egyptian creators who best fit your campaign brief." }, { property: "og:title", content: "AI Creator Match — UpCreator" }, { property: "og:description", content: "Find the Egyptian creators who best fit your campaign brief." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: AiMatch,
});

const SORT_OPTIONS: { value: MatchSort; label: string }[] = [
  { value: "score", label: "Match score" },
  { value: "rate", label: "Rate" },
  { value: "followers", label: "Followers" },
];

const SCORE_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 50, label: "50%+" },
  { value: 70, label: "70%+" },
  { value: 85, label: "85%+" },
];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-bold transition",
        active ? "border-primary bg-primary text-primary-foreground" : "border-transparent bg-muted hover:opacity-80",
      )}
    >
      {children}
    </button>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="flex flex-wrap items-center gap-1.5">{children}</div>
    </div>
  );
}

function AiMatch() {
  const { t, language } = useI18n();
  const { fmt, currency } = useLocalizedFormat();
  const { store, user } = useApp();
  const mine = store.campaigns.filter((c) => c.status !== "closed");
  const [id, setId] = useState<number | null>(null);
  const [filters, setFilters] = useState<MatchFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<MatchSort>("score");
  const campaign = mine.find((c) => c.id === id) ?? mine[0];

  const patch = (next: Partial<MatchFilters>) => setFilters((prev) => ({ ...prev, ...next }));
  const results = useMemo(() => (campaign ? matchCreators(campaign, store) : []), [campaign, store]);
  const niches = useMemo(() => ["All", ...creatorNiches(store.users)], [store.users]);
  const ceiling = useMemo(() => (campaign ? rateCeiling(results, campaign.budget) : 500), [campaign, results]);
  const shown = useMemo(() => sortMatches(filterMatches(results, filters), sort), [results, filters, sort]);

  if (!campaign) {
    return (<><PageHeader title="AI Creator Match" />
      <EmptyState icon="🤖" title="Post a campaign first" body="Matches appear once you have an open campaign."
        action={<Link to="/app/campaigns/new" className={btnPrimary}>{t("Post a campaign")}</Link>} /></>);
  }

  const maxRate = filters.maxRate ?? ceiling;
  const withinBudget = filters.maxRate === campaign.budget;

  return (
    <>
      <PageHeader title="AI Creator Match" subtitle="Pick a campaign and see the creators who fit it best." />
      <div className="mb-6 max-w-md"><Field label="Campaign">
        <select className={inputCls} value={campaign.id} onChange={(e) => setId(Number(e.target.value))}>
          {mine.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select></Field></div>

      <div className="mb-6 rounded-2xl border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              data-testid="match-search"
              className={cn(inputCls, "ps-9")}
              placeholder={t("Search creators by name…")}
              aria-label={t("Search creators by name…")}
              value={filters.q}
              onChange={(e) => patch({ q: e.target.value })}
            />
          </div>
          {isFiltered(filters) && (
            <button data-testid="clear-filters" type="button" onClick={() => setFilters(EMPTY_FILTERS)} className={cn(btnGhost, "px-3 py-2 text-xs")}>
              <X className="size-3.5" />
              {t("Clear filters")}
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Group label={t("Match score")}>
            {SCORE_OPTIONS.map((o) => (
              <Chip key={o.value} active={filters.minScore === o.value} onClick={() => patch({ minScore: o.value })}>
                <bdi>{o.value === 0 ? t(o.label) : o.label}</bdi>
              </Chip>
            ))}
          </Group>
          <Group label={t("Platform")}>
            {PLATFORM_OPTIONS.map((p) => (
              <Chip key={p} active={filters.platform === p} onClick={() => patch({ platform: p })}>{t(p)}</Chip>
            ))}
          </Group>
          <Group label={t("Niche")}>
            {niches.map((n) => (
              <Chip key={n} active={filters.niche === n} onClick={() => patch({ niche: n })}>{t(n)}</Chip>
            ))}
          </Group>
          <Group label={t("Budget")}>
            <div className="w-full">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold">{filters.maxRate === null ? t("Any budget") : <bdi>{currency} {fmt(maxRate)}</bdi>}</span>
                <Chip active={withinBudget} onClick={() => patch({ maxRate: withinBudget ? null : campaign.budget })}>{t("Within campaign budget")}</Chip>
              </div>
              <input
                data-testid="budget-slider"
                type="range"
                min={0}
                max={ceiling}
                step={250}
                value={maxRate}
                dir="ltr"
                aria-label={t("Maximum creator rate")}
                onChange={(e) => { const v = Number(e.target.value); patch({ maxRate: v >= ceiling ? null : v }); }}
                className="mt-3 w-full accent-primary"
              />
            </div>
          </Group>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-1.5 border-t pt-4">
          <span className="me-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("Sort by")}</span>
          {SORT_OPTIONS.map((o) => (
            <Chip key={o.value} active={sort === o.value} onClick={() => setSort(o.value)}>{t(o.label)}</Chip>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState icon="🎯" title="No creators yet" />
      ) : (
        <>
          <p data-testid="match-count" className="mb-3 text-sm text-muted-foreground">
            {language === "ar"
              ? <>يظهر <bdi>{fmt(shown.length)}</bdi> من <bdi>{fmt(results.length)}</bdi> صنّاع محتوى</>
              : <>Showing <bdi>{fmt(shown.length)}</bdi> of <bdi>{fmt(results.length)}</bdi> creators</>}
          </p>
          {shown.length === 0 ? (
            <EmptyState icon="🔍" title="No creators match these filters" body="Try widening your filters or clearing the search."
              action={<button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className={btnGhost}>{t("Clear filters")}</button>} />
          ) : (
            <div className="space-y-3">
              {shown.map((r) => (
                <div key={r.creator.id} data-testid="match-row" className="flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-5">
                  <Avatar name={r.creator.name} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 font-bold">{r.creator.name} {r.creator.verified && <VerifiedBadge />} <span className="text-xs font-normal text-muted-foreground">· {t(r.creator.niche ?? "")}{r.creator.rate != null && <> · <bdi>{currency} {fmt(r.creator.rate)}</bdi></>}{r.creator.followers != null && <> · <bdi>{fmt(r.creator.followers)}</bdi> {t("Followers")}</>}</span></p>
                    {r.creator.bio && <p className="text-sm text-muted-foreground">{r.creator.bio}</p>}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {creatorBadges(r.creator, store).map((b) => <BadgePill key={b.label} badge={b} />)}
                      {r.reasons.map((x) => <span key={x.label} className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", x.good ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>{t(x.label)}</span>)}
                      {r.applied && <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">{t("Already applied")}</span>}
                    </div>
                  </div>
                  <div className="text-center"><p className="text-2xl font-extrabold text-primary"><bdi>{fmt(r.score)}%</bdi></p><p className="text-xs text-muted-foreground">{t("match")}</p></div>
                  <Link to="/app/messages" className={btnGhost}>{t("Message")}</Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
