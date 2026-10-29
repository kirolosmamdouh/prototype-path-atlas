import { useI18n } from "@/lib/i18n";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/uc/AuthShell";
import { Field, btnPrimary, inputCls } from "@/components/uc/ui";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
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

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = login(email, password);
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
        <button className={`${btnPrimary} w-full`}>{t("Log in")}</button>
      </form>
      <div className="mt-6 rounded-xl bg-muted p-4 text-xs text-muted-foreground">
        <p className="mb-2 font-bold text-foreground">{t("Demo accounts (password: demo1234)")}</p>
        <div className="flex gap-2">
          {["brand@demo.com", "creator@demo.com"].map((d) => (
            <button key={d} type="button" onClick={() => { setEmail(d); setPassword("demo1234"); }} className="rounded-lg border bg-background px-2.5 py-1 font-semibold text-foreground">
              {d}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here? <Link to="/register" className="font-bold text-primary">{t("Create an account")}</Link>
      </p>
    </AuthShell>
  );
}
