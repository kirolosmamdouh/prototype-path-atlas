import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/uc/ComingSoon";

export const Route = createFileRoute("/app/profile")({
  component: () => <ComingSoon title="Profile" icon="👤" body="Edit your public profile, portfolio and social links." />,
});
