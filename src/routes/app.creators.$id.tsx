import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { Avatar, BadgeCriteria, BadgePill, EmptyState, PageHeader, VerifiedBadge, btnGhost, btnPrimary } from "@/components/uc/ui";
import { useI18n, useLocalizedFormat } from "@/lib/i18n";
import { JOB_SUCCESS_MIN, creatorBadges, jobSuccess } from "@/lib/badges";
import { pastCollaborators } from "@/lib/match";
import { PublicProfileCard } from "@/components/uc/PublicProfileCard";
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
      <PublicProfileCard person={creator} store={store}
        action={<Link to="/app/messages" className={btnPrimary}><MessageSquare className="h-4 w-4" /> {t("Message")}</Link>}
        extraStat={{ value: <bdi>{fmt(collab?.jobs ?? 0)}</bdi>, label: t("Jobs together") }}>
        {collab && (
          <p className="mt-6 text-sm text-muted-foreground">
            {t("Last campaign together:")} <span className="font-semibold text-foreground">{collab.lastCampaign.title}</span>
          </p>
        )}
      </PublicProfileCard>
      <div className="mt-6"><BadgeCriteria /></div>
    </>
  );
}
