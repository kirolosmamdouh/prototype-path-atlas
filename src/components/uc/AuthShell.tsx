import type { ReactNode } from "react";
import { Logo } from "./Logo";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 lg:flex">
        <Logo inverted />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-brand-gradient opacity-30 blur-3xl" />
        <div className="relative">
          <h2 className="text-5xl font-black leading-tight text-sidebar-accent-foreground">
            Where Egypt's brands meet <span className="text-accent">creators.</span>
          </h2>
          <p className="mt-4 max-w-md text-sidebar-foreground">500+ vetted creators. Proposals in under 24 hours.</p>
        </div>
        <p className="text-xs text-sidebar-foreground">© 2026 UpCreator</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mb-8 mt-1 text-sm text-muted-foreground">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
