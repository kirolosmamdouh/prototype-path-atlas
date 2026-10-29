import { useI18n } from "@/lib/i18n";
import { Link } from "@tanstack/react-router";
import { EmptyState, PageHeader, btnPrimary } from "./ui";

/** Placeholder for prototype screens not yet converted. */
export function ComingSoon({ title, icon, body }: { title: string; icon: string; body: string }) {
  const { t, language } = useI18n();
  return (
    <>
      <PageHeader title={t(title)} />
      <EmptyState icon={icon} title={t("Coming in the next phase")} body={t(body)}
        action={<Link to="/app" className={btnPrimary}>{t("Back to dashboard")}</Link>} />
    </>
  );
}
