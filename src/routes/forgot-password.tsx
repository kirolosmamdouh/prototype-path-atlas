import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/uc/AuthShell";
import { Field, btnPrimary, inputCls } from "@/components/uc/ui";
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Reset password — UpCreator" },
      { name: "description", content: "Get a link to reset your UpCreator password." },
      { property: "og:title", content: "Reset password — UpCreator" },
      { property: "og:description", content: "Get a link to reset your UpCreator password." },
    ],
  }),
  component: Forgot,
});

function Forgot() {
  const { t, language } = useI18n();
  const [sent, setSent] = useState(false);
  const [email,setEmail]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  const submit = async (e: FormEvent) => { e.preventDefault();setBusy(true);const result=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/reset-password`});if(result.error)setError(result.error.message);else setSent(true);setBusy(false); };
  return (
    <AuthShell title={t("Forgot your password?")} subtitle={t("We'll email you a reset link.")}>
      {sent ? (
        <p className="rounded-xl bg-success/10 p-4 text-sm text-success">{t("If that email exists, a reset link is on its way.")}</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field label={t("Email")}><input className={inputCls} type="email" dir="ltr" required value={email} onChange={e=>setEmail(e.target.value)} /></Field>
          {error&&<p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button disabled={busy} variant="ghost" className={`${btnPrimary} w-full`}>{t("Send reset link")}</Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm"><Link to="/login" className="font-bold text-primary">{t("\u2190 Back to log in")}</Link></p>
    </AuthShell>
  );
}
