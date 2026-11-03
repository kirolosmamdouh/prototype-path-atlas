import { LanguageToggle } from "@/components/uc/LanguageToggle";
import { VerifiedBadge } from "@/components/uc/ui";
import { ReelShowcase } from "@/components/uc/ReelShowcase";
import { useI18n } from "@/lib/i18n";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/uc/Logo";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight, Briefcase, Check, MapPin, Play, Search, Sparkles, Star, Users, Wand2 } from "lucide-react";
import salma from "@/assets/creator-salma.jpg";
import nour from "@/assets/creator-nour.jpg";
import mariam from "@/assets/creator-mariam.jpg";
import laila from "@/assets/creator-laila.jpg";
import facial from "@/assets/testimonial-facial.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UpCreator — Hire Egypt's best UGC creators" },
      { name: "description", content: "Discover authentic Egyptian creators, launch UGC campaigns and get AI-matched proposals within 24 hours." },
      { property: "og:title", content: "UpCreator — Hire Egypt's best UGC creators" },
      { property: "og:description", content: "Discover authentic creators, launch UGC campaigns and turn real experiences into brand content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const creators = [
  { img: salma, name: "Salma Hassan", nameAr: "سلمى حسن", niche: "Beauty", tag: ["Beauty & skincare", "الجمال والعناية"], f: "120K", city: ["Cairo", "القاهرة"], rate: "4,000", m: 96 },
  { img: nour, name: "Nour Adel", nameAr: "نور عادل", niche: "Fashion", tag: ["Fashion & lifestyle", "الموضة وأسلوب الحياة"], f: "210K", city: ["Giza", "الجيزة"], rate: "5,000", m: 92 },
  { img: mariam, name: "Mariam Saad", nameAr: "مريم سعد", niche: "Lifestyle", tag: ["Travel & culture", "السفر والثقافة"], f: "86K", city: ["Cairo", "القاهرة"], rate: "3,500", m: 89 },
  { img: laila, name: "Laila Omar", nameAr: "ليلى عمر", niche: "Beauty", tag: ["Beauty & wellness", "الجمال والعافية"], f: "64K", city: ["Alexandria", "الإسكندرية"], rate: "3,200", m: 87 },
];
const steps = [
  { icon: Search, t: ["Discover the right voices", "اكتشف الأصوات المناسبة"], d: ["Search a trusted network of creators by niche, audience, platform, and creative style.", "ابحث في شبكة موثوقة من صنّاع المحتوى حسب المجال والجمهور والمنصة والأسلوب."] },
  { icon: Briefcase, t: ["Launch a clear brief", "أطلق حملة واضحة"], d: ["Set deliverables, usage rights, timing, and budget in one beautifully simple campaign.", "حدّد المخرجات وحقوق الاستخدام والتوقيت والميزانية في حملة واحدة بسيطة."] },
  { icon: Users, t: ["Collaborate in one place", "تعاون في مكان واحد"], d: ["Review proposals, message talent, track deliverables, and keep every detail aligned.", "راجع العروض وراسل المبدعين وتابع المخرجات في مكان واحد."] },
  { icon: Sparkles, t: ["Create content that converts", "محتوى يحقق نتائج"], d: ["Receive authentic, platform-native content built to earn attention and trust.", "احصل على محتوى أصيل يناسب كل منصة ويكسب الانتباه والثقة."] },
];
const campaigns = [
  { niche: "Beauty", brand: "NILE COSMETICS", t: ["Summer glow serum launch", "إطلاق سيروم توهج الصيف"], d: ["2 TikTok videos", "فيديوهان على تيك توك"], b: "4,500", cls: "bg-primary/10" },
  { niche: "Fashion", brand: "CAIRO KICKS", t: ["Street style sneaker drop", "إطلاق أحذية ستريت ستايل"], d: ["1 Reel + 1 TikTok", "ريل + تيك توك"], b: "6,000", cls: "bg-success/15" },
  { niche: "Lifestyle", brand: "SAHARA LIVING", t: ["A slower morning at home", "صباح هادئ في المنزل"], d: ["3 UGC videos", "٣ فيديوهات UGC"], b: "5,200", cls: "bg-chart-5/25" },
];

function Landing() {
  const { t, language } = useI18n();
  const ar = language === "ar";
  const L = (p: string[]) => (ar ? p[1] : p[0]);
  const [filter, setFilter] = useState("All");
  const shown = creators.filter((c) => filter === "All" || c.niche === filter);
  const px = "px-[clamp(20px,5vw,60px)]";

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <nav className={cn("fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur", px)}>
        <Logo />
        <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#creators" className="hover:text-foreground">{ar ? "اعثر على مبدعين" : "Find creators"}</a>
          <a href="#campaigns" className="hover:text-foreground">{ar ? "الحملات" : "Campaigns"}</a>
          <a href="#how" className="hover:text-foreground">{ar ? "كيف يعمل" : "How it works"}</a>
          <a href="#stories" className="hover:text-foreground">{ar ? "قصص النجاح" : "Success stories"}</a>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Link to="/login" className="hidden px-3 py-2 text-sm font-medium sm:inline">{t("Log in")}</Link>
          <Link to="/register" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-brand">
            {ar ? "ابدأ الآن" : "Get started"} <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className={cn("mx-auto grid max-w-7xl items-center gap-12 pb-16 pt-32 lg:grid-cols-2", px)}>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">{t("Egypt's #1 UGC marketplace")}</span>
          <h1 className="mt-4 text-[clamp(40px,5.5vw,68px)] font-extrabold leading-[1.05] tracking-tight">
            {ar ? "محتوى حقيقي يصنعه" : "Real content made by"} <span className="text-brand-gradient">{ar ? "مبدعين حقيقيين." : "real creators."}</span>
          </h1>
          <p className="mt-5 max-w-lg text-muted-foreground">
            {ar ? "اكتشف صنّاع محتوى أصيلين، وأطلق حملات UGC، وحوّل التجارب الحقيقية إلى محتوى قوي لعلامتك." : "Discover authentic creators, launch UGC campaigns, and turn real experiences into powerful brand content."}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/register" search={{ role: "brand" }} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-brand">
              {ar ? "ابحث عن مبدعين" : "Find creators"} <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
            </Link>
            <Link to="/register" search={{ role: "creator" }} className="rounded-full border bg-card px-6 py-3 text-sm font-semibold">
              {ar ? "انضم كصانع محتوى" : "Join as a creator"}
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {[salma, nour, mariam].map((s) => <img key={s} src={s} alt="" className="h-8 w-8 rounded-full border-2 border-background object-cover" />)}
            </div>
            <span><b className="text-foreground">500+</b> {ar ? "مبدع موثّق" : "vetted creators"}</span>
            <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-chart-5 text-chart-5" /><b className="text-foreground">4.9</b> {ar ? "من العلامات" : "from brands"}</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <img src={nour} alt={ar ? "صانعة محتوى" : "Creator portrait"} width={768} height={1024} className="aspect-[4/5] w-full rounded-[28px] object-cover shadow-2xl" />
          <div className="absolute -bottom-6 start-6 end-6 flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-xl">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><Wand2 className="h-4 w-4" /></span>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">{ar ? "اكتملت المطابقة الذكية" : "AI match complete"}</p>
              <p className="text-sm font-semibold">{ar ? "١٢ مبدعًا يناسبون إطلاق منتجك" : "12 creators fit your beauty launch"}</p>
            </div>
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-bold text-success">96%</span>
          </div>
        </div>
      </section>

      <ReelShowcase />

      {/* Stats */}
      <section className="mt-10 border-y bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {[["500+", "Vetted creators", "+٥٠٠"], ["EGP 2M+", "Creator earnings", "+٢ مليون ج.م"], ["94%", "Brand satisfaction", "٩٤٪"], ["< 24h", "First proposals", "أقل من ٢٤ ساعة"]].map(([v, l, va]) => (
            <div key={l} className="border-e py-8 text-center last:border-e-0">
              <p className="text-3xl font-extrabold"><bdi>{ar ? va : v}</bdi></p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t(l ?? "")}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Creator discovery */}
      <section id="creators" className={cn("mx-auto max-w-7xl py-20", px)}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">{ar ? "اكتشاف المبدعين" : "Creator discovery"}</p>
            <h2 className="mt-3 max-w-xl text-[clamp(30px,4vw,44px)] font-extrabold leading-tight tracking-tight">{ar ? "مواهب تبدو وكأنها صُنعت لعلامتك." : "Talent that feels made for your brand."}</h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">{ar ? "ابحث بحدسك الإبداعي أو دع الذكاء الاصطناعي يحوّل حملتك إلى قائمة مرتّبة بأسباب واضحة." : "Search by creative instinct or let AI turn your brief into a ranked shortlist with clear matching reasons."}</p>
        </div>
        <div className="mt-8 rounded-3xl border bg-card p-5 shadow-sm">
          <div className="flex gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-full border bg-muted px-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input className="w-full bg-transparent py-2.5 text-sm outline-none" placeholder={ar ? "صنّاع محتوى لايف ستايل مصريون" : "Egyptian lifestyle creators"} />
            </div>
            <Link to="/register" search={{ role: "brand" }} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
              <Wand2 className="h-4 w-4" /> {ar ? "بحث ذكي" : "AI search"}
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["All", "Beauty", "Fashion", "Lifestyle"].map((n) => (
              <button key={n} onClick={() => setFilter(n)} className={cn("rounded-full px-3 py-1 text-xs font-semibold", filter === n ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary")}>{t(n)}</button>
            ))}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((c) => (
              <div key={c.name} className="overflow-hidden rounded-2xl border bg-card">
                <div className="relative aspect-[4/5]">
                  <img src={c.img} alt={c.name} loading="lazy" width={768} height={1024} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                  <span className="absolute start-3 top-3 rounded-full bg-background px-2 py-0.5 text-[11px] font-bold"><bdi>{c.m}%</bdi> {ar ? "تطابق" : "match"}</span>
                  <span className="absolute end-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/30 text-background backdrop-blur"><Play className="h-3.5 w-3.5 fill-current" /></span>
                  <div className="absolute inset-x-3 bottom-3 text-background">
                    <p className="flex items-center gap-1 font-bold">{ar ? c.nameAr : c.name} <VerifiedBadge className="text-background" /></p>
                    <p className="text-xs opacity-80">{L(c.tag)} · <bdi>{c.f}</bdi></p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{L(c.city)}</span>
                  <b className="text-sm"><bdi>{ar ? "ج.م" : "EGP"} {c.rate}</bdi></b>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-sidebar py-20 text-sidebar-accent-foreground">
        <div className={cn("mx-auto max-w-7xl", px)}>
          <p className="text-xs font-bold uppercase tracking-widest text-sidebar-foreground">{ar ? "كيف يعمل UpCreator" : "How UpCreator works"}</p>
          <h2 className="mt-3 max-w-2xl text-[clamp(30px,4vw,44px)] font-extrabold leading-tight tracking-tight">{ar ? "من الفكرة إلى محتوى عالي الأداء، دون فوضى." : "From idea to high-performing content, without the chaos."}</h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-sidebar-border bg-sidebar-border sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={i} className="bg-sidebar p-6">
                <div className="flex items-center justify-between text-xs text-sidebar-foreground"><span>0{i + 1}</span><span className="grid h-8 w-8 place-items-center rounded-full bg-sidebar-accent"><s.icon className="h-4 w-4" /></span></div>
                <h3 className="mt-10 font-bold">{L(s.t)}</h3>
                <p className="mt-2 text-xs leading-relaxed text-sidebar-foreground">{L(s.d)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaigns */}
      <section id="campaigns" className={cn("mx-auto max-w-7xl py-20", px)}>
        <p className="text-xs font-bold uppercase tracking-widest text-primary">{ar ? "فرص مباشرة" : "Live opportunities"}</p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <h2 className="text-[clamp(28px,3.5vw,40px)] font-extrabold tracking-tight">{ar ? "حملات تستحق الإبداع." : "Campaigns worth creating for."}</h2>
          <Link to="/register" search={{ role: "creator" }} className="flex items-center gap-1 text-sm font-semibold">{ar ? "استكشف الكل" : "Explore all"} <ArrowRight className="h-4 w-4 rtl:-scale-x-100" /></Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {campaigns.map((c, i) => (
            <Link key={c.brand} to="/register" search={{ role: "creator" }} className="group overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-lg">
              <div className={cn("relative h-36 p-4", c.cls)}>
                <span className="rounded-md bg-background px-2 py-1 text-[11px] font-semibold">{t(c.niche)}</span>
                <span className="absolute bottom-3 start-4 text-4xl font-extrabold text-foreground/10">0{i + 1}</span>
                <span className="absolute bottom-4 end-4 grid h-9 w-9 place-items-center rounded-full bg-foreground text-background"><ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" /></span>
              </div>
              <div className="p-5">
                <p className="text-[11px] font-semibold tracking-wider text-muted-foreground">{c.brand}</p>
                <h3 className="mt-1 text-lg font-bold">{L(c.t)}</h3>
                <div className="mt-4 flex justify-between text-xs text-muted-foreground"><span>{L(c.d)}</span><b className="text-sm text-foreground"><bdi>{ar ? "ج.م" : "EGP"} {c.b}</bdi></b></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section id="stories" className={cn("mx-auto max-w-7xl pb-20", px)}>
        <div className="grid overflow-hidden rounded-3xl bg-primary/5 md:grid-cols-2">
          <img src={facial} alt={ar ? "تصوير محتوى عناية بالبشرة" : "Skincare content being filmed"} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover" />
          <div className="flex flex-col justify-center p-8 md:p-12">
            <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}</div>
            <blockquote className="mt-5 text-2xl font-bold leading-snug">
              {ar ? "«ساعدنا UpCreator على التوقف عن التخمين. وجدنا ثلاثة مبدعين فهموا عملاءنا فورًا، وأصبحت الحملة أفضل إطلاق لنا هذا العام.»" : "“UpCreator helped us stop guessing. We found three creators who understood our customer immediately—and the campaign became our best launch of the year.”"}
            </blockquote>
            <p className="mt-6 text-sm font-bold">{ar ? "منى السيد" : "Mona El-Sayed"}</p>
            <p className="text-xs text-muted-foreground">{ar ? "مديرة النمو، نايل كوزمتكس" : "Growth Director, Nile Cosmetics"}</p>
            <div className="mt-8 flex gap-10">
              <div><p className="text-2xl font-extrabold"><bdi>3.4×</bdi></p><p className="text-xs text-muted-foreground">{ar ? "العائد على الإنفاق" : "return on spend"}</p></div>
              <div><p className="text-2xl font-extrabold"><bdi>1.8M</bdi></p><p className="text-xs text-muted-foreground">{ar ? "مشاهدة عضوية" : "organic views"}</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={cn("mx-auto max-w-7xl pb-16", px)}>
        <div className="rounded-3xl bg-brand-gradient px-6 py-16 text-center text-primary-foreground">
          <Sparkles className="mx-auto h-6 w-6 opacity-80" />
          <h2 className="mx-auto mt-4 max-w-2xl text-[clamp(28px,4vw,44px)] font-extrabold leading-tight">{ar ? "حملتك الرائعة القادمة تبدأ بالمبدع المناسب." : "Your next great campaign starts with the right creator."}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm opacity-90">{ar ? "انضم إلى أسرع سوق للمبدعين نموًا في مصر واصنع محتوى يختار الناس مشاهدته." : "Join Egypt's fastest-growing creator marketplace and make content people choose to watch."}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/register" search={{ role: "brand" }} className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground">{ar ? "ابدأ حملة" : "Start a campaign"} <ArrowRight className="h-4 w-4 rtl:-scale-x-100" /></Link>
            <Link to="/register" search={{ role: "creator" }} className="rounded-full border border-primary-foreground/40 px-6 py-3 text-sm font-semibold">{ar ? "أنشئ ملفك" : "Build your profile"}</Link>
          </div>
          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs opacity-80"><Check className="h-3.5 w-3.5" />{ar ? "الانضمام مجاني. لا حاجة لبطاقة ائتمان." : "Free to join. No credit card required."}</p>
        </div>
      </section>

      <footer className={cn("border-t bg-card", px)}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 py-8 text-sm">
          <Logo />
          <p className="text-xs text-muted-foreground">{ar ? "صُنع في القاهرة لصنّاع المحتوى والعلامات في الشرق الأوسط." : "Built in Cairo for creators and brands across MENA."}</p>
          <div className="flex gap-5"><a href="#creators">{ar ? "المبدعون" : "Creators"}</a><a href="#campaigns">{ar ? "الحملات" : "Campaigns"}</a><Link to="/login">{t("Log in")}</Link></div>
        </div>
      </footer>
    </div>
  );
}
