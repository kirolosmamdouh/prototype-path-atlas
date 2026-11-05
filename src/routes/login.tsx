import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/uc/AuthShell";
import { Field, btnPrimary, inputCls } from "@/components/uc/ui";
import { useApp } from "@/lib/store";
import { SocialSignIn } from '@/components/uc/SocialSignIn';

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Log in — UpCreator" },
      { name: "description", content: "Log in to your UpCreator brand or creator account." },
      { property: "og:title", content: "Log in — UpCreator" },
      { property: "og:description", content: "Log in to your UpCreator brand or creator account." },
    ],
  }),
  component: Login,
});

function Login() {
  const { t, language } = useI18n();
  const { login } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy,setBusy]=useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const err = await login(email, password);
    setBusy(false);
    if (err) return setError(err);
    nav({ to: "/app" });
  };

  return (
    <AuthShell title={t("Welcome back")} subtitle={t("Log in to continue to your dashboard.")}>
      <form onSubmit={submit} className="space-y-4">
        <Field label={t("Email")}><input className={inputCls} type="email" dir="ltr" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label={t("Password")}><input className={inputCls} type="password" dir="ltr" required value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{t(error)}</p>}
        <div className="text-end"><Link to="/forgot-password" className="text-sm font-semibold text-primary">{t("Forgot password?")}</Link></div>
        <Button disabled={busy} variant="ghost" className={`${btnPrimary} w-full`}>{t(busy?'Loading…':"Log in")}</Button>
      </form>
      <SocialSignIn />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("New here?")} <Link to="/register" className="font-bold text-primary">{t("Create an account")}</Link>
      </p>
    </AuthShell>
  );
}
