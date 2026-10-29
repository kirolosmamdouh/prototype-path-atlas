import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/uc/ComingSoon";

export const Route = createFileRoute("/app/billing")({
  head: () => ({ meta: [{"title": "Billing \u2014 UpCreator"}, {"name": "description", "content": "Billing in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:title", "content": "Billing \u2014 UpCreator"}, {"property": "og:description", "content": "Billing in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: () => <ComingSoon title="Billing" icon="💳" body="Invoices, payment methods and escrow funding." />,
});
