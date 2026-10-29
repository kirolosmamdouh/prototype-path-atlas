import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/uc/ComingSoon";

export const Route = createFileRoute("/app/talent")({
  component: () => <ComingSoon title="Talent Pool" icon="🎯" body="Save and organise your favourite creators." />,
});
