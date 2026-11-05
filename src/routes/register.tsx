import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/uc/AuthShell";
import { Field, btnPrimary, inputCls } from "@/components/uc/ui";
import { useApp } from "@/lib/store";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SocialSignIn } from '@/components/uc/SocialSignIn';

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>): { role?: Role } =>
    s["role"] === "brand" || s["role"] === "creator" ? { role: s["role"] } : {},
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Sign up — UpCreator" },
      { name: "description", content: "Join UpCreator as a brand or a creator — free to start." },
      { property: "og:title", content: "Sign up — UpCreator" },
      { property: "og:description", content: "Join UpCreator as a brand or a creator — free to start." },
    ],
  }),
  component: Register,
});

const ROLES: { id: Role; icon: string; label: string; desc: string }[] = [
  { id: "brand", icon: "🏢", label: "Brand", desc: "Post campaigns, hire creators" },
  { id: "creator", icon: "🎬", label: "Creator", desc: "Apply to campaigns, earn" },
];

function Register() {
  const { t, language } = useI18n();
  const { role: initial } = Route.useSearch();
  const { register } = useApp();
  const nav = useNavigate();
  const [role, setRole] = useState<Role>(initial ?? "creator");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy,setBusy]=useState(false),[sent,setSent]=useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const err = await register({ name, email, password, role });
    setBusy(false);
    if (err) return setError(err);
    setSent(true);
  };

  return (
    <AuthShell title={t("Create your account")} subtitle={t("It takes less than a minute.")}>
      <div className="mb-6 grid grid-cols-2 gap-3">
        {ROLES.map((r) => (
          <Button variant="ghost" key={r.id} type="button" onClick={() => setRole(r.id)}
            aria-pressed={role === r.id}
            className={cn("block h-auto min-h-36 whitespace-normal rounded-2xl border-2 p-4 text-start transition", role === r.id ? "border-primary bg-secondary" : "hover:border-primary/40")}>
            <div className="text-2xl">{r.icon}</div>
            <p className="mt-2 font-bold">{t(r.label)}</p>
            <p className="text-xs text-muted-foreground">{t(r.desc)}</p>
          </Button>
        ))}
      </div>
      {sent ? <p role="status" className="rounded-lg bg-success/10 p-4 text-success">{t('Check your email to confirm your account, then log in to finish setup.')}</p> : <form onSubmit={submit} className="space-y-4">
        <Field label={t(role === "brand" ? "Brand name" : "Full name")}><input className={inputCls} required value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label={t("Email")}><input className={inputCls} type="email" dir="ltr" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label={t("Password")}><input className={inputCls} type="password" dir="ltr" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{t(error)}</p>}
        <Button disabled={busy} variant="ghost" className={`${btnPrimary} w-full`}>{language === "ar" ? `إنشاء حساب ${t(role)}` : `Create ${role} account`}</Button>
      </form>}
      <SocialSignIn />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("Already have an account?")} <Link to="/login" className="font-bold text-primary">{t("Log in")}</Link>
      </p>
    </AuthShell>
  );
}
