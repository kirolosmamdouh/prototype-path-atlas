import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/uc/ComingSoon";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{"title": "Profile \u2014 UpCreator"}, {"name": "description", "content": "Profile in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:title", "content": "Profile \u2014 UpCreator"}, {"property": "og:description", "content": "Profile in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: () => <ComingSoon title="Profile" icon="👤" body="Edit your public profile, portfolio and social links." />,
});
