import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function LanguageToggle() {
  const { language, setLanguage } = useI18n();
  const label = language === "en" ? "التبديل إلى العربية" : "Switch to English";
  return (
    <Button type="button" variant="outline" onClick={() => setLanguage(language === "en" ? "ar" : "en")} aria-label={label} title={label} className="shrink-0 gap-1.5 px-2.5" dir={language === "en" ? "rtl" : "ltr"}>
      <Languages aria-hidden="true" />
      <span lang={language === "en" ? "ar" : "en"}>{language === "en" ? "العربية" : "English"}</span>
    </Button>
  );
}