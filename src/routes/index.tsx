import { LanguageToggle } from "@/components/uc/LanguageToggle";
import { useI18n } from "@/lib/i18n";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/uc/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UpCreator — Hire Egypt's best UGC creators" },
      { name: "description", content: "Post a brief, get AI-matched creators and real proposals within 24 hours. Built for Egypt & MENA." },
      { property: "og:title", content: "UpCreator — Hire Egypt's best UGC creators" },
      { property: "og:description", content: "Post a brief, get AI-matched creators and real proposals within 24 hours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: "🏷️", label: "For Brands", head: "Find your creator in minutes.", sub: "Post a brief, let AI rank the best-matched Egyptian creators — and receive real proposals in hours." },
  { icon: "🎬", label: "For Creators", head: "Get paid for what you love.", sub: "Browse 500+ live brand campaigns and apply with a single proposal. No experience required." },
  { icon: "🤖", label: "AI Matching", head: "Zero guesswork, perfect matches.", sub: "AI reads your campaign brief and ranks creators by niche, audience, and past performance." },
];
const faqs = [
  { q: "How is UpCreator different?", a: "Built specifically for Egypt & MENA. Every creator is vetted, and AI matches happen in seconds." },
  { q: "Is it free for creators?", a: "Yes. Creators join and apply completely free. A small platform fee applies on successful deals." },
  { q: "How do payments work?", a: "Payment is held securely in escrow and released once the brand approves the content." },
  { q: "What platforms are supported?", a: "TikTok, Instagram Reels, YouTube Shorts, Snapchat Stories, and static posts." },
  { q: "How fast can I get proposals?", a: "Most brands receive 5–20 proposals within the first 24 hours of posting a campaign." },
];
const stats = [
  { value: "500+", label: "Vetted creators" },
  { value: "EGP 2M+", label: "Creator earnings" },
  { value: "94%", label: "Brand satisfaction" },
  { value: "< 24h", label: "First proposals" },
];
const reels = ["Fashion · 45.2k", "Beauty · 19.4k", "Food · 12.8k", "Travel · 55.6k", "Fitness · 22.3k", "Tech · 9.1k", "Dance · 88.2k", "Vlog · 21.8k"];

function Landing() {
  const { t, language } = useI18n();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <nav className="landing-nav fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 px-[clamp(20px,5vw,60px)] backdrop-blur">
        <Logo />
        <div className="hidden items-center gap-8 text-sm font-semibold text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">{t("For Brands")}</a>
          <a href="#features" className="hover:text-foreground">{t("For Creators")}</a>
          <a href="#faq" className="hover:text-foreground">{t("FAQ")}</a>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Link to="/login" className="auth-link px-4 py-2 text-sm font-semibold">{t("Log in")}</Link>
          <Link to="/register" className="signup-link rounded-full bg-pink px-6 py-2.5 text-sm font-extrabold text-pink-foreground shadow-pink transition hover:-translate-y-px hover:opacity-90">
            {t("Sign up")}
          </Link>
        </div>
      </nav>

      <section className="relative px-[clamp(20px,5vw,60px)] pb-20 pt-36 text-center">
        <div className="pointer-events-none absolute left-[8%] top-28 h-40 w-40 rounded-full border-4 border-chart-5 opacity-40" />
        <div className="pointer-events-none absolute right-[10%] top-56 h-24 w-24 rounded-full bg-pink opacity-15" />
        <span className="inline-block rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-secondary-foreground">
          {t("Egypt's #1 UGC marketplace")}
        </span>
        <h1 className="mx-auto mt-6 max-w-4xl text-[clamp(44px,6vw,80px)] font-black leading-[1.02] tracking-tight">
          {t("Real creators.")} <span className="text-brand-gradient">{t("Real results.")}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          {t("Brands post a brief, AI finds the perfect creators, and proposals land in your inbox within 24 hours.")}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/register" search={{ role: "brand" }} className="rounded-full bg-foreground px-7 py-3.5 text-sm font-extrabold text-background transition hover:opacity-90">
            {t("I'm a brand \u2192")}
          </Link>
          <Link to="/register" search={{ role: "creator" }} className="rounded-full bg-accent px-7 py-3.5 text-sm font-extrabold text-accent-foreground transition hover:opacity-90">
            {t("I'm a creator \u2192")}
          </Link>
        </div>
      </section>

      <div className="overflow-hidden py-4">
        <div className="reel-track flex w-max animate-[marquee_28s_linear_infinite] gap-4">
          {[...reels, ...reels].map((r, i) => (
            <div key={i} className="flex h-64 w-40 shrink-0 items-end rounded-3xl bg-brand-gradient p-3" style={{ opacity: 0.75 + (i % 3) * 0.1 }}>
              <span className="rounded-full bg-background/90 px-2.5 py-1 text-xs font-bold">▶ {r}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-16 md:grid-cols-4">
        {stats.map((s) => (
          <div key={t(s.label)} className="text-center">
            <p className="text-4xl font-black">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t(s.label)}</p>
          </div>
        ))}
      </section>

      <section id="features" className="mx-auto grid max-w-6xl gap-5 px-6 py-12 md:grid-cols-3">
        {features.map((f) => (
          <div key={t(f.label)} className="rounded-3xl border bg-card p-8">
            <div className="text-3xl">{f.icon}</div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">{t(f.label)}</p>
            <h3 className="mt-2 text-2xl font-extrabold">{t(f.head)}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t(f.sub)}</p>
          </div>
        ))}
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-8 text-center text-4xl font-black">{t("Questions, answered.")}</h2>
        {faqs.map((f, i) => (
          <button key={t(f.q)} onClick={() => setOpen(open === i ? null : i)} className="block w-full border-b py-5 text-start">
            <div className="flex justify-between text-lg font-bold">{t(f.q)}<span>{open === i ? "−" : "+"}</span></div>
            {open === i && <p className="mt-2 text-muted-foreground">{t(f.a)}</p>}
          </button>
        ))}
      </section>

      <section className="mx-6 mb-10 rounded-[32px] bg-sidebar px-8 py-16 text-center md:mx-auto md:max-w-6xl">
        <h2 className="text-4xl font-black text-sidebar-accent-foreground">{t("Ready to")} <span className="text-accent">{t("create?")}</span></h2>
        <Link to="/register" className="mt-8 inline-block rounded-full bg-pink px-8 py-3.5 font-extrabold text-pink-foreground shadow-pink">
          {t("Get started free")}
        </Link>
      </section>
      <footer className="pb-10 text-center text-xs text-muted-foreground">{t("\u00a9 2026 UpCreator \u00b7 Cairo, Egypt")}</footer>
    </div>
  );
}
