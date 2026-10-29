import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/uc/ComingSoon";

export const Route = createFileRoute("/app/earnings")({
  head: () => ({ meta: [{"title": "Earnings \u2014 UpCreator"}, {"name": "description", "content": "Earnings in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:title", "content": "Earnings \u2014 UpCreator"}, {"property": "og:description", "content": "Earnings in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: () => <ComingSoon title="Earnings" icon="💰" body="Payouts, escrow balance and earning history." />,
});
