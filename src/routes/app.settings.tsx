import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Field, PageHeader, btnGhost, btnPrimary, inputCls } from "@/components/uc/ui";
import { useI18n, type Language } from "@/lib/i18n";
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — UpCreator" }, { name: "description", content: "Manage your UpCreator account, language and password." }, { property: "og:title", content: "Settings — UpCreator" }, { property: "og:description", content: "Manage your UpCreator account, language and password." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: SettingsPage,
});

const card = "rounded-2xl border bg-card p-6 space-y-4";

function SettingsPage() {
  const { t, language, setLanguage } = useI18n();
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [err, setErr] = useState<string>();
  if (!user) return null;

  const changePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 8) return setErr("Password must be at least 8 characters.");
    const result=await supabase.auth.updateUser({password:next,current_password:cur});
    if(result.error)return setErr(result.error.message);
    setErr(undefined); setCur(""); setNext("");
    toast.success(t("Password updated"));
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Account, language and password." />
      <div className="grid max-w-3xl gap-6">
        <section className={card}>
          <Field label="Email"><input className={inputCls} value={user.email} readOnly /></Field>
          <Field label="Language">
            <select className={inputCls} value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
              <option value="en">English</option><option value="ar">العربية</option>
            </select>
          </Field>
        </section>
        <form onSubmit={changePw} className={card}>
          <h2 className="font-bold">{t("Change password")}</h2>
          <Field label="Current password"><input type="password" className={inputCls} value={cur} onChange={(e) => setCur(e.target.value)} /></Field>
          <Field label="New password" error={err}><input type="password" className={inputCls} value={next} onChange={(e) => setNext(e.target.value)} /></Field>
          <Button className={btnPrimary}>{t("Update password")}</Button>
        </form>
        <section className={card}>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={async () => { await logout(); await navigate({ to: "/login",replace:true }); }}>{t("Log out")}</Button>
          </div>
        </section>
      </div>
    </>
  );
}
