import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/uc/ComingSoon";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{"title": "Settings \u2014 UpCreator"}, {"name": "description", "content": "Settings in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:title", "content": "Settings \u2014 UpCreator"}, {"property": "og:description", "content": "Settings in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: () => <ComingSoon title="Settings" icon="⚙️" body="Account, notifications, password and privacy settings." />,
});
