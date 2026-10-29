import { Link } from "@tanstack/react-router";
import { EmptyState, PageHeader, btnPrimary } from "./ui";

/** Placeholder for prototype screens not yet converted. */
export function ComingSoon({ title, icon, body }: { title: string; icon: string; body: string }) {
  return (
    <>
      <PageHeader title={title} />
      <EmptyState icon={icon} title="Coming in the next phase" body={body}
        action={<Link to="/app" className={btnPrimary}>Back to dashboard</Link>} />
    </>
  );
}
