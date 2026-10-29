import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/uc/ComingSoon";

export const Route = createFileRoute("/app/earnings")({
  component: () => <ComingSoon title="Earnings" icon="💰" body="Payouts, escrow balance and earning history." />,
});
