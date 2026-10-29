import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { directionFor, I18nProvider, LANGUAGE_KEY, useI18n } from "@/lib/i18n";

let switchLanguage: ReturnType<typeof useI18n>["setLanguage"] = () => {};
function Probe() {
  switchLanguage = useI18n().setLanguage;
  return null;
}

afterEach(() => { cleanup(); localStorage.clear(); });

describe("Language preferences", () => {
  it("uses right-to-left for Arabic and left-to-right for English", () => {
    expect(directionFor("ar")).toBe("rtl");
    expect(directionFor("en")).toBe("ltr");
  });

  it("restores the selected language on reload", async () => {
    localStorage.setItem(LANGUAGE_KEY, "ar");
    render(<I18nProvider><Probe /></I18nProvider>);
    await waitFor(() => expect(document.documentElement.dir).toBe("rtl"));
    expect(document.documentElement.lang).toBe("ar");
    expect(localStorage.getItem(LANGUAGE_KEY)).toBe("ar");
  });

  it("persists a switch back to English", async () => {
    localStorage.setItem(LANGUAGE_KEY, "ar");
    render(<I18nProvider><Probe /></I18nProvider>);
    act(() => switchLanguage("en"));
    await waitFor(() => expect(localStorage.getItem(LANGUAGE_KEY)).toBe("en"));
    expect(document.documentElement.dir).toBe("ltr");
    expect(document.documentElement.lang).toBe("en");
  });
});