import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Field, PageHeader, btnPrimary, inputCls } from "@/components/uc/ui";
import { useApp } from "@/lib/store";
import type { Campaign } from "@/lib/types";

export const Route = createFileRoute("/app/campaigns/new")({
  head: () => ({ meta: [{"title": "Post a campaign \u2014 UpCreator"}, {"name": "description", "content": "Post a campaign in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:title", "content": "Post a campaign \u2014 UpCreator"}, {"property": "og:description", "content": "Post a campaign in UpCreator, the Egyptian brand and creator marketplace."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }), component: CampaignForm });

const NICHES = ["Fashion", "Beauty", "Tech", "Fitness", "Food", "Travel", "Lifestyle", "Gaming", "Education", "Other"];
const PLATFORMS: Campaign["platform"][] = ["TikTok", "Instagram", "YouTube", "Both"];

function CampaignForm() {
  const { t, language } = useI18n();
  const { user, update } = useApp();
  const nav = useNavigate();
  const [f, setF] = useState({ title: "", description: "", niche: "Beauty", platform: "TikTok" as Campaign["platform"], budget: "", deliverables: "", deadline: "" });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    let newId = 0;
    update((s) => {
      newId = Math.max(0, ...s.campaigns.map((c) => c.id)) + 1;
      return { campaigns: [...s.campaigns, { id: newId, userId: user.id, ...f, budget: Number(f.budget), deadline: new Date(f.deadline).toISOString(), status: "open", createdAt: new Date().toISOString() }] };
    });
    setTimeout(() => nav({ to: "/app/campaigns/$id", params: { id: String(newId) } }), 0);
  };

  return (
    <>
      <PageHeader title={t("Post a campaign")} subtitle={t("Creators will start sending proposals right away.")} />
      <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-card p-8">
        <Field label={t("Campaign title")}><input className={inputCls} required value={f.title} onChange={set("title")} /></Field>
        <Field label={t("Brief")}><textarea className={inputCls} rows={5} required value={f.description} onChange={set("description")} /></Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("Niche")}><select className={inputCls} value={f.niche} onChange={set("niche")}>{NICHES.map((n) => <option key={n} value={n}>{t(n)}</option>)}</select></Field>
          <Field label={t("Platform")}><select className={inputCls} value={f.platform} onChange={set("platform")}>{PLATFORMS.map((n) => <option key={n} value={n}>{t(n)}</option>)}</select></Field>
          <Field label={t("Budget (EGP)")}><input className={inputCls} type="number" min={1} required value={f.budget} onChange={set("budget")} /></Field>
          <Field label={t("Deadline")}><input className={inputCls} type="date" dir="ltr" required value={f.deadline} onChange={set("deadline")} /></Field>
        </div>
        <Field label={t("Deliverables")}><input className={inputCls} placeholder={t("e.g. 2 TikTok videos (30s)")} required value={f.deliverables} onChange={set("deliverables")} /></Field>
        <Button variant="ghost" className={btnPrimary}>{t("Publish campaign")}</Button>
      </form>
    </>
  );
}
