import { useI18n } from "@/lib/i18n";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/uc/AuthShell";
import { Field, btnPrimary, inputCls } from "@/components/uc/ui";
import { useApp } from "@/lib/store";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>): { role?: Role } =>
    s["role"] === "brand" || s["role"] === "creator" ? { role: s["role"] } : {},
  head: () => ({
    meta: [
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

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = register({ name, email, password, role });
    if (err) return setError(err);
    nav({ to: "/app" });
  };

  return (
    <AuthShell title={t("Create your account")} subtitle={t("It takes less than a minute.")}>
      <div className="mb-6 grid grid-cols-2 gap-3">
        {ROLES.map((r) => (
          <button key={r.id} type="button" onClick={() => setRole(r.id)}
            className={cn("rounded-2xl border-2 p-4 text-start transition", role === r.id ? "border-primary bg-secondary" : "hover:border-primary/40")}>
            <div className="text-2xl">{r.icon}</div>
            <p className="mt-2 font-bold">{t(r.label)}</p>
            <p className="text-xs text-muted-foreground">{t(r.desc)}</p>
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-4">
        <Field label={t(role === "brand" ? "Brand name" : "Full name")}><input className={inputCls} required value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label={t("Email")}><input className={inputCls} type="email" dir="ltr" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label={t("Password")}><input className={inputCls} type="password" dir="ltr" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{t(error)}</p>}
        <button className={`${btnPrimary} w-full`}>{language === "ar" ? `إنشاء حساب ${t(role)}` : `Create ${role} account`}</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="font-bold text-primary">{t("Log in")}</Link>
      </p>
    </AuthShell>
  );
}
