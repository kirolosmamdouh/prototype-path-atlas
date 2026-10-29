import { useLocalizedFormat } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Avatar, EmptyState, Field, StatusBadge, btnGhost, btnPrimary, inputCls } from "@/components/uc/ui";
import { useApp } from "@/lib/store";
import type { ApplicationStatus } from "@/lib/types";

export const Route = createFileRoute("/app/campaigns/$id")({ component: CampaignDetail });

function CampaignDetail() {
  const { t, language } = useI18n();
  const { ago, fmt, fmtDate, currency } = useLocalizedFormat();
  const { id } = Route.useParams();
  const { store, user, update } = useApp();
  const c = store.campaigns.find((x) => x.id === Number(id));
  const [pitch, setPitch] = useState("");
  const [rate, setRate] = useState("");

  if (!c || !user) return <EmptyState icon="🤷" title={t("Campaign not found")} action={<Link to="/app" className={btnPrimary}>{t("Back to dashboard")}</Link>} />;

  const brand = store.users.find((u) => u.id === c.userId);
  const apps = store.applications.filter((a) => a.campaignId === c.id);
  const mine = apps.find((a) => a.creatorId === user.id);
  const isOwner = c.userId === user.id;

  const apply = (e: FormEvent) => {
    e.preventDefault();
    update((s) => ({
      applications: [...s.applications, {
        id: Math.max(0, ...s.applications.map((a) => a.id)) + 1,
        campaignId: c.id, creatorId: user.id, pitch, rate: Number(rate), status: "pending", createdAt: new Date().toISOString(),
      }],
    }));
  };
  const setStatus = (appId: number, status: ApplicationStatus) =>
    update((s) => ({ applications: s.applications.map((a) => (a.id === appId ? { ...a, status } : a)) }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="rounded-2xl border bg-card p-8">
        <Link to={user.role === "brand" ? "/app" : "/app/campaigns"} className="text-sm font-semibold text-muted-foreground">{t("\u2190 Back")}</Link>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">{t(c.niche)}</span>
          <StatusBadge status={c.status} />
          <span className="text-xs text-muted-foreground">{language === "ar" ? "نُشرت" : "Posted"} {ago(c.createdAt)}</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{c.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{language === "ar" ? "بواسطة" : "by"} {brand?.company ?? brand?.name}</p>
        <p className="mt-6 leading-relaxed">{c.description}</p>
        <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[["Budget", `${currency} ${fmt(c.budget)}`], ["Platform", c.platform], ["Deliverables", c.deliverables], ["Deadline", fmtDate(c.deadline)]].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-muted p-3"><dt className="text-xs text-muted-foreground">{t(k)}</dt><dd className="mt-1 text-sm font-bold">{v}</dd></div>
          ))}
        </dl>

        {isOwner && (
          <>
            <h2 className="mb-3 mt-10 text-lg font-bold">{t("Proposals")} ({apps.length})</h2>
            <div className="space-y-3">
              {apps.map((a) => {
                const cr = store.users.find((u) => u.id === a.creatorId);
                return (
                  <div key={a.id} className="flex flex-wrap items-center gap-4 rounded-xl border p-4">
                    <Avatar name={cr?.name ?? "?"} />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{cr?.name} · {currency} {fmt(a.rate)}</p>
                      <p className="text-sm text-muted-foreground">{a.pitch}</p>
                    </div>
                    {a.status === "pending" ? (
                      <div className="flex gap-2">
                        <button onClick={() => setStatus(a.id, "rejected")} className={btnGhost}>{t("Decline")}</button>
                        <button onClick={() => setStatus(a.id, "accepted")} className={btnPrimary}>{t("Accept")}</button>
                      </div>
                    ) : <StatusBadge status={a.status} />}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {user.role === "creator" && (
        <aside className="h-fit rounded-2xl border bg-card p-6 lg:sticky lg:top-10">
          {mine ? (
            <div className="text-center">
              <p className="text-3xl"</p>
              <p className="mt-2 font-bold">{t("Proposal sent")}</p>
              <div className="mt-2"><StatusBadge status={mine.status} /></div>
              <p className="mt-3 text-sm text-muted-foreground">{language === "ar" ? "أجرك:" : "Your rate:"} {currency} {fmt(mine.rate)}</p>
            </div>
          ) : (
            <form onSubmit={apply} className="space-y-4">
              <h2 className="text-lg font-bold">{t("Send a proposal")}</h2>
              <Field label={t("Why you?")}><textarea className={inputCls} rows={4} required value={pitch} onChange={(e) => setPitch(e.target.value)} /></Field>
              <Field label={t("Your rate (EGP)")}><input className={inputCls} type="number" min={1} required value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
              <button className={`${btnPrimary} w-full`}>{t("Submit proposal")}</button>
            </form>
          )}
        </aside>
      )}
    </div>
  );
}
