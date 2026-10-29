import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/uc/ComingSoon";

export const Route = createFileRoute("/app/talent")({
  head: () => ({ meta: [{"title": "Talent Pool \u2014 UpCreator"}, {"name": "description", "content": "Talent Pool in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:title", "content": "Talent Pool \u2014 UpCreator"}, {"property": "og:description", "content": "Talent Pool in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: () => <ComingSoon title="Talent Pool" icon="🎯" body="Save and organise your favourite creators." />,
});
