import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { arabic } from "./translations";

export type Language = "en" | "ar";
export const LANGUAGE_KEY = "uc_language";
export const directionFor = (language: Language) => language === "ar" ? "rtl" : "ltr";
export function translate(language: Language, text: string): string {
  return language === "ar" ? arabic[text] ?? text : text;
}

const I18nContext = createContext({
  language: "en" as Language,
  setLanguage: (_language: Language) => {},
  t: (text: string) => text,
  locale: "en-EG",
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_KEY);
      if (stored === "ar" || stored === "en") setLanguage(stored);
    } catch { /* Storage may be disabled. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = directionFor(language);
    if (ready) {
      try { localStorage.setItem(LANGUAGE_KEY, language); } catch { /* Keep the switch usable. */ }
    }
  }, [language, ready]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t: (text) => translate(language, text), locale: language === "ar" ? "ar-EG" : "en-EG" }}>
      <div dir={directionFor(language)} lang={language} className="contents">{children}</div>
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);

export function useLocalizedFormat() {
  const { language, locale } = useI18n();
  const fmt = (n: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);
  const fmtDate = (date: string) => new Date(date).toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" });
  const ago = (date: string) => {
    const minutes = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
    if (minutes < 1) return language === "ar" ? "الآن" : "just now";
    const value = minutes < 60 ? minutes : minutes < 1440 ? Math.floor(minutes / 60) : Math.floor(minutes / 1440);
    const unit = minutes < 60 ? "minute" : minutes < 1440 ? "hour" : "day";
    return new Intl.RelativeTimeFormat(locale, { numeric: "always" }).format(-value, unit);
  };
  return { fmt, fmtDate, ago, currency: language === "ar" ? "ج.م" : "EGP" };
}