import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/uc/ComingSoon";

export const Route = createFileRoute("/app/ai-match")({
  head: () => ({ meta: [{"title": "AI Creator Match \u2014 UpCreator"}, {"name": "description", "content": "AI Creator Match in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:title", "content": "AI Creator Match \u2014 UpCreator"}, {"property": "og:description", "content": "AI Creator Match in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: () => <ComingSoon title="AI Creator Match" icon="🤖" body="AI will rank creators against your campaign brief." />,
});
