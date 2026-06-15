import { createAdminClient } from "@/lib/supabase/admin";
import type { SiteSettings } from "./types";

const DEFAULT_SETTINGS: SiteSettings = {
  id: "default",
  brand_name: { fr: "Business Algerie", ar: "بيزنس الجزائر", en: "Business Algerie" },
  tagline: {
    fr: "Formations et accompagnement marketing digital en Algérie.",
    ar: "دورات تدريبية ومرافقة في التسويق الرقمي في الجزائر.",
    en: "Digital marketing training and coaching in Algeria.",
  },
  logo_url: null,
  favicon_url: null,
  colors: {
    primary: "#0f172a",
    accent: "#f97316",
    soft: "#f8fafc",
    text: "#334155",
    background: "#ffffff",
    foreground: "#334155",
  },
  fonts: { heading: "var(--font-sans)", body: "var(--font-sans)" },
  seo_default: {
    titleTemplate: "%s | Business Algerie",
    description: "Formations et accompagnement marketing digital en Algérie.",
    keywords: ["marketing digital", "Algérie", "e-commerce", "formation", "site web"],
    ogImageUrl: "/images/hero.webp",
  },
  social_links: {
    facebook: "https://facebook.com/businessalgerie",
    instagram: "https://instagram.com/businessalgerie",
    linkedin: "https://linkedin.com/company/businessalgerie",
    youtube: "https://youtube.com/@businessalgerie",
  },
  pixels: { facebook: undefined, tiktok: undefined, linkedin: undefined },
  analytics: { ga4MeasurementId: undefined, searchConsoleHtmlTag: undefined },
  updated_at: new Date().toISOString(),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .single();

    if (error || !data) {
      console.warn("getSiteSettings fallback", error?.message);
      return DEFAULT_SETTINGS;
    }

    return { ...DEFAULT_SETTINGS, ...(data as SiteSettings) };
  } catch (err) {
    console.warn("getSiteSettings error, using fallback", err);
    return DEFAULT_SETTINGS;
  }
}
