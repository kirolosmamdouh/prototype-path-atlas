import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/uc/ComingSoon";

export const Route = createFileRoute("/app/settings")({
  component: () => <ComingSoon title="Settings" icon="⚙️" body="Account, notifications, password and privacy settings." />,
});
