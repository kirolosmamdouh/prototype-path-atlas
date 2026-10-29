import { Link } from "@tanstack/react-router";
import type { Campaign, Store } from "@/lib/types";
import { ago, fmt } from "@/lib/store";
import { StatusBadge } from "./ui";

export function CampaignCard({ campaign: c, store }: { campaign: Campaign; store: Store }) {
  const brand = store.users.find((u) => u.id === c.userId);
  const proposals = store.applications.filter((a) => a.campaignId === c.id).length;
  return (
    <Link
      to="/app/campaigns/$id"
      params={{ id: String(c.id) }}
      className="group flex flex-col rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">{c.niche}</span>
        <StatusBadge status={c.status} />
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug group-hover:text-primary">{c.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
      <div className="mt-auto flex items-end justify-between pt-5">
        <div>
          <p className="text-xs text-muted-foreground">{brand?.company ?? brand?.name} · {c.platform}</p>
          <p className="text-xl font-extrabold">EGP {fmt(c.budget)}</p>
        </div>
        <p className="text-xs text-muted-foreground">{proposals} proposals · {ago(c.createdAt)}</p>
      </div>
    </Link>
  );
}
