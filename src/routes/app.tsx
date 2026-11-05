import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/uc/LanguageToggle";
import { useI18n } from "@/lib/i18n";
import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/uc/Logo";
import { TopBar } from "@/components/uc/TopBar";
import { Avatar } from "@/components/uc/ui";
import { canAccess, navItems, type AppPath } from "@/lib/nav";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Onboarding } from '@/components/uc/Onboarding';

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Workspace — UpCreator" }, { name: "description", content: "Your UpCreator workspace for brand and creator collaborations." }, { property: "og:title", content: "Workspace — UpCreator" }, { property: "og:description", content: "Your UpCreator workspace for brand and creator collaborations." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { name: "robots", content: "noindex" }] }),
  component: AppLayout,
});

function AppLayout() {
  const { t, language } = useI18n();
  const { ready, signedIn, user, store, logout, error, refresh,workspaces,workspaceId,selectWorkspace } = useApp();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (ready && !signedIn) nav({ to: "/login",replace:true });
  }, [ready, signedIn, nav]);
  useEffect(() => setMenuOpen(false), [pathname]);

  if (ready && error) return <div className="p-8"><p role="alert">{t('Unable to load your account.')}</p><Button onClick={()=>void refresh()}>{t('Try again')}</Button></div>;
  if (ready && signedIn && !user) return <Onboarding />;
  if (!ready || !user) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">{t("Loading\u2026")}</div>;
  }

  const items = navItems(user.role, store, user.id);
  const current = pathname.replace(/\/$/, "") as AppPath;
  const blocked = current.startsWith("/app/creators/") ? user.role !== "brand" : isKnown(current) && !canAccess(user.role, current);

  return (
    <div className="flex min-h-screen bg-muted">
      <aside className={cn(
        "fixed inset-y-0 start-0 z-40 flex w-64 flex-col bg-sidebar p-4 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:rtl:translate-x-0",
        menuOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
      )}>
        <div className="px-2 py-3"><Logo inverted /></div>
        <div className="px-2 pt-3"><LanguageToggle /></div>
        {user.role==='brand'&&<div className="mt-4"><label className="text-xs text-sidebar-foreground" htmlFor="workspace-switch">{t('Workspace')}</label><select id="workspace-switch" value={workspaceId??''} onChange={e=>selectWorkspace(e.target.value)} className="mt-1 w-full rounded-md border border-sidebar-border bg-sidebar p-2 text-sm text-sidebar-foreground">{workspaces.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}</select><Link to="/app/workspaces" className="mt-2 block text-xs text-sidebar-foreground">{t('Manage workspaces')}</Link></div>}
        <nav className="mt-6 flex-1 space-y-1 overflow-y-auto">
          {items.map((it) => {
            const active = it.to === "/app" ? current === "/app" : current.startsWith(it.to);
            return (
              <Link key={it.to} to={it.to}
                className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")}>
                <span className="w-5 text-center">{it.icon}</span>
                <span className="flex-1">{t(it.label)}</span>
                {!!it.badge && <span className="rounded-full bg-pink px-2 text-xs font-bold text-pink-foreground">{it.badge}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-sidebar-border p-3">
          <Avatar name={user.name} className="h-9 w-9" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-sidebar-accent-foreground">{user.name}</p>
            <p className="text-xs capitalize text-sidebar-foreground">{t(user.role)}</p>
          </div>
          <Button variant="ghost" onClick={async () => { await logout(); await nav({ to: "/login",replace:true }); }} className="text-xs font-semibold text-sidebar-foreground hover:text-sidebar-accent-foreground" title={t("Log out")}>
            ⎋
          </Button>
        </div>
      </aside>
      {menuOpen && <div className="fixed inset-0 z-30 bg-foreground/40 lg:hidden" onClick={() => setMenuOpen(false)} />}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-14 items-center border-b bg-background px-4 lg:hidden">
          <Button variant="ghost" onClick={() => setMenuOpen(true)} className="me-3 text-xl" aria-label={t("Open menu")}>☰</Button>
          <Logo /><div className="ms-auto"><LanguageToggle /></div>
        </header>
        <div className="sticky top-14 z-20 border-b bg-background px-4 py-2 lg:top-0 lg:px-10 lg:py-3">
          <div className="mx-auto flex max-w-6xl justify-end"><TopBar /></div>
        </div>
        <main className="mx-auto max-w-6xl p-6 lg:p-10">
          {blocked ? (
            <div className="rounded-2xl border bg-card p-10 text-center">
              <h2 className="text-xl font-bold">{language === "ar" ? `هذه الصفحة مخصصة لـ${user.role === "brand" ? "صنّاع المحتوى" : "العلامات التجارية"}` : `This page is for ${user.role === "brand" ? "creators" : "brands"}`}</h2>
              <Link to="/app" className="mt-4 inline-block font-bold text-primary">{t("Go to your dashboard \u2192")}</Link>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}

function isKnown(p: string): p is AppPath {
  return ["/app/workspaces", "/app/campaigns/new", "/app/manage", "/app/applications", "/app/ai-match", "/app/talent", "/app/earnings", "/app/billing"].includes(p);
}
