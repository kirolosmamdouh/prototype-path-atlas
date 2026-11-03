import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { Avatar, BadgeCriteria, BadgePill, EmptyState, PageHeader, VerifiedBadge, btnGhost, btnPrimary } from "@/components/uc/ui";
import { useI18n, useLocalizedFormat } from "@/lib/i18n";
import { JOB_SUCCESS_MIN, creatorBadges, jobSuccess } from "@/lib/badges";
import { pastCollaborators } from "@/lib/match";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/app/creators/$id")({
  head: () => ({ meta: [{ title: "Creator Profile — UpCreator" }, { name: "description", content: "See a creator's niche, platforms, rate and your past work together." }, { property: "og:title", content: "Creator Profile — UpCreator" }, { property: "og:description", content: "See a creator's niche, platforms, rate and your past work together." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { name: "robots", content: "noindex" }] }),
  component: CreatorProfile,
});

function CreatorProfile() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const { fmt, currency } = useLocalizedFormat();
  const { store, user } = useApp();
  const creator = store.users.find((u) => u.id === Number(id) && u.role === "creator");

  if (!creator) {
    return (<><PageHeader title="Creator profile" />
      <EmptyState icon="👤" title="Creator not found"
        action={<Link to="/app" className={btnGhost}>{t("Back to dashboard")}</Link>} /></>);
  }

  const js = jobSuccess(creator.id, store);
  const collab = user ? pastCollaborators(user.id, store).find((c) => c.creator.id === creator.id) : undefined;

  return (
    <>
      <PageHeader title="Creator profile" />
      <div className="rounded-2xl border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start gap-5">
          <Avatar name={creator.name} className="h-20 w-20 rounded-2xl text-2xl" />
          <div className="min-w-0 flex-1">
            <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">{creator.name} {creator.verified && <VerifiedBadge className="h-5 w-5" />}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(creator.niche ?? "")} · {t(creator.location ?? "Egypt")}
            </p>
            {creator.bio && <p className="mt-3 max-w-2xl text-sm">{creator.bio}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {(creator.platforms ?? []).map((p) => (
                <span key={p} className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold">{t(p)}</span>
              ))}
              {js != null && js >= JOB_SUCCESS_MIN && <BadgePill badge={{ label: "Job Success", icon: "crown", tone: "brand" }} suffix={`${js}%`} />}
              {creatorBadges(creator, store).map((b) => <BadgePill key={b.label} badge={b} />)}
            </div>
          </div>
          <Link to="/app/messages" className={btnPrimary}>
            <MessageSquare className="h-4 w-4" /> {t("Message")}
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:max-w-lg sm:grid-cols-3">
          <div className="rounded-2xl border p-4 text-center">
            <p className="text-xl font-extrabold">{creator.rate != null ? <bdi>{currency} {fmt(creator.rate)}</bdi> : "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("Rate")}</p>
          </div>
          <div className="rounded-2xl border p-4 text-center">
            <p className="text-xl font-extrabold">{creator.followers != null ? <bdi>{fmt(creator.followers)}</bdi> : "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("Followers")}</p>
          </div>
          <div className="rounded-2xl border p-4 text-center">
            <p className="text-xl font-extrabold"><bdi>{fmt(collab?.jobs ?? 0)}</bdi></p>
            <p className="mt-1 text-xs text-muted-foreground">{t("Jobs together")}</p>
          </div>
        </div>

        {collab && (
          <p className="mt-6 text-sm text-muted-foreground">
            {t("Last campaign together:")} <span className="font-semibold text-foreground">{collab.lastCampaign.title}</span>
          </p>
        )}
      </div>
      <div className="mt-6"><BadgeCriteria /></div>
    </>
  );
}
