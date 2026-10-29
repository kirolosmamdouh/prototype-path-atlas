import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CampaignCard } from "@/components/uc/CampaignCard";
import { EmptyState, PageHeader, inputCls } from "@/components/uc/ui";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/campaigns/")({
  head: () => ({ meta: [{"title": "Browse campaigns \u2014 UpCreator"}, {"name": "description", "content": "Browse campaigns in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:title", "content": "Browse campaigns \u2014 UpCreator"}, {"property": "og:description", "content": "Browse campaigns in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }), component: CampaignList });

const NICHES = ["All", "Fashion", "Beauty", "Tech", "Fitness", "Food", "Travel", "Lifestyle"];

function CampaignList() {
  const { t, language } = useI18n();
  const { store } = useApp();
  const [q, setQ] = useState("");
  const [niche, setNiche] = useState("All");
  const list = store.campaigns.filter(
    (c) => c.status === "open" && (niche === "All" || c.niche === niche) &&
      (c.title + c.description).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHeader title={t("Browse campaigns")} subtitle={language === "ar" ? `${list.length} حملة متاحة من علامات تجارية في مصر` : `${list.length} open campaigns from brands across Egypt`} />
      <input className={cn(inputCls, "mb-4")} placeholder={t("Search campaigns\u2026")} value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="mb-6 flex flex-wrap gap-2">
        {NICHES.map((n) => (
          <Button variant="ghost" key={n} onClick={() => setNiche(n)}
            className={cn("rounded-full border px-4 py-1.5 text-sm font-semibold", niche === n ? "border-foreground bg-foreground text-background" : "bg-card")}>
            {t(n)}
          </Button>
        ))}
      </div>
      {list.length ? (
        <div className="grid gap-4 md:grid-cols-2">{list.map((c) => <CampaignCard key={c.id} campaign={c} store={store} />)}</div>
      ) : (
        <EmptyState icon="🔍" title={t("No campaigns match")} body={t("Try a different niche or search.")} />
      )}
    </>
  );
}
