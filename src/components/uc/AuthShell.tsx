import { LanguageToggle } from "./LanguageToggle";
import { useI18n } from "@/lib/i18n";
import type { ReactNode } from "react";
import { Logo } from "./Logo";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const { t, language } = useI18n();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 lg:flex">
        <Logo inverted />
        <div className="absolute -end-24 top-1/3 h-96 w-96 rounded-full bg-brand-gradient opacity-30 blur-3xl" />
        <div className="relative">
          <h2 className="text-5xl font-black leading-tight text-sidebar-accent-foreground">
            Where Egypt's brands meet <span className="text-accent">{t("creators.")}</span>
          </h2>
          <p className="mt-4 max-w-md text-sidebar-foreground">{t("500+ vetted creators. Proposals in under 24 hours.")}</p>
        </div>
        <p className="text-xs text-sidebar-foreground"</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-end"><LanguageToggle /></div>
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="text-3xl font-extrabold tracking-tight">{t(title)}</h1>
          <p className="mb-8 mt-1 text-sm text-muted-foreground">{t(subtitle)}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
