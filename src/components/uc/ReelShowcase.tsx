import { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import serum from "@/assets/reel-serum.mp4.asset.json";
import coffee from "@/assets/reel-coffee.mp4.asset.json";
import sneakers from "@/assets/reel-sneakers.mp4.asset.json";

const reels = [serum.url, coffee.url, sneakers.url];
const stats = [
  ["145+", "Brand campaigns", "+١٤٥", "حملة"],
  ["1M+", "Views delivered", "+١ مليون", "مشاهدة"],
  ["45%", "More engagement", "٤٥٪", "تفاعل أعلى"],
  ["200k+", "Followers reached", "+٢٠٠ ألف", "متابع"],
];

/** Scrolling strip of real UGC clips with a phone frame playing one in the centre. */
export function ReelShowcase() {
  const { language } = useI18n();
  const ar = language === "ar";
  const [active, setActive] = useState(0);
  const strip = [...reels, ...reels, ...reels, ...reels];

  return (
    <section className="relative overflow-hidden py-20">
      <div className="reel-track flex w-max gap-6" style={{ animation: "marquee 40s linear infinite" }}>
        {strip.map((src, i) => (
          <video key={i} src={src} autoPlay muted loop playsInline preload="metadata"
            className="h-80 w-48 shrink-0 rounded-2xl object-cover opacity-80 shadow-brand sm:h-96 sm:w-56" />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="relative">
          <div className="relative h-[440px] w-[220px] overflow-hidden rounded-[2.5rem] border-[6px] border-foreground bg-foreground shadow-brand sm:h-[500px] sm:w-[250px]">
            <video key={active} src={reels[active]} autoPlay muted playsInline onEnded={() => setActive((a) => (a + 1) % reels.length)}
              className="h-full w-full object-cover" />
            <span className="absolute start-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-foreground rtl:translate-x-1/2" />
            <p className="absolute inset-x-0 top-9 text-center text-[11px] font-semibold text-primary-foreground">{ar ? "متابَعون | لك" : "Following | For You"}</p>
            <div className="absolute bottom-16 end-3 flex flex-col gap-3 text-primary-foreground">
              <Heart className="h-5 w-5" /><MessageCircle className="h-5 w-5" /><Share2 className="h-5 w-5" />
            </div>
          </div>
          {[0, 1].map((slot) => {
            const s = stats[(active + slot * 2) % stats.length];
            return (
              <div key={`${active}-${slot}`} className={`absolute animate-in fade-in zoom-in-90 duration-500 rounded-xl border bg-card/90 px-3 py-2 shadow-brand backdrop-blur ${slot ? "-end-14 top-24" : "-start-16 bottom-28"}`}>
                <p className="text-xl font-extrabold text-primary"><bdi>{ar ? s[2] : s[0]}</bdi></p>
                <p className="text-[10px] font-semibold text-muted-foreground">{ar ? s[3] : s[1]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
