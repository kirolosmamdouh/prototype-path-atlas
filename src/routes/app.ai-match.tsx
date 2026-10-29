import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/uc/ComingSoon";

export const Route = createFileRoute("/app/ai-match")({
  component: () => <ComingSoon title="AI Creator Match" icon="🤖" body="AI will rank creators against your campaign brief." />,
});
