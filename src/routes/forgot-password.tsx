import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/uc/AuthShell";
import { Field, btnPrimary, inputCls } from "@/components/uc/ui";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — UpCreator" },
      { name: "description", content: "Get a link to reset your UpCreator password." },
      { property: "og:title", content: "Reset password — UpCreator" },
      { property: "og:description", content: "Get a link to reset your UpCreator password." },
    ],
  }),
  component: Forgot,
});

function Forgot() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); };
  return (
    <AuthShell title="Forgot your password?" subtitle="We'll email you a reset link.">
      {sent ? (
        <p className="rounded-xl bg-success/10 p-4 text-sm text-success">If that email exists, a reset link is on its way. (Email sending isn't connected yet.)</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email"><input className={inputCls} type="email" required /></Field>
          <button className={`${btnPrimary} w-full`}>Send reset link</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm"><Link to="/login" className="font-bold text-primary">← Back to log in</Link></p>
    </AuthShell>
  );
}
