import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/uc/ComingSoon";

export const Route = createFileRoute("/app/billing")({
  component: () => <ComingSoon title="Billing" icon="💳" body="Invoices, payment methods and escrow funding." />,
});
