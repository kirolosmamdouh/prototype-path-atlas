import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Avatar, EmptyState, Field, PageHeader, btnGhost, btnPrimary, inputCls } from "@/components/uc/ui";
import { useI18n, useLocalizedFormat } from "@/lib/i18n";
import { matchCreators } from "@/lib/match";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/ai-match")({
  head: () => ({ meta: [{ title: "AI Creator Match — UpCreator" }, { name: "description", content: "Find the Egyptian creators who best fit your campaign brief." }, { property: "og:title", content: "AI Creator Match — UpCreator" }, { property: "og:description", content: "Find the Egyptian creators who best fit your campaign brief." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: AiMatch,
});

function AiMatch() {
  const { t } = useI18n();
  const { fmt, currency } = useLocalizedFormat();
  const { store, user } = useApp();
  const mine = store.campaigns.filter((c) => c.userId === user?.id && c.status !== "closed");
  const [id, setId] = useState<number | null>(null);
  const campaign = mine.find((c) => c.id === id) ?? mine[0];

  if (!campaign) {
    return (<><PageHeader title="AI Creator Match" />
      <EmptyState icon="🤖" title="Post a campaign first" body="Matches appear once you have an open campaign."
        action={<Link to="/app/campaigns/new" className={btnPrimary}>{t("Post a campaign")}</Link>} /></>);
  }
  const results = matchCreators(campaign, store);
  return (
    <>
      <PageHeader title="AI Creator Match" subtitle="Pick a campaign and see the creators who fit it best." />
      <div className="mb-6 max-w-md"><Field label="Campaign">
        <select className={inputCls} value={campaign.id} onChange={(e) => setId(Number(e.target.value))}>
          {mine.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select></Field></div>
      {results.length === 0 ? <EmptyState icon="🎯" title="No creators yet" /> : (
        <div className="space-y-3">
          {results.map((r) => (
            <div key={r.creator.id} data-testid="match-row" className="flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-5">
              <Avatar name={r.creator.name} />
              <div className="min-w-0 flex-1">
                <p className="font-bold">{r.creator.name} <span className="text-xs font-normal text-muted-foreground">· {t(r.creator.niche ?? "")}{r.creator.rate != null && <> · <bdi>{currency} {fmt(r.creator.rate)}</bdi></>}</span></p>
                {r.creator.bio && <p className="text-sm text-muted-foreground">{r.creator.bio}</p>}
                <div className="mt-2 flex flex-wrap gap-1.5">
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
  );
}
