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
  logo_width: 32,
  logo_height: 32,
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
  local_business: {
    name: "Business Algerie",
    description: "Agence de marketing digital et formations pour entrepreneurs algériens.",
    url: "https://businessalgerie.com",
    telephone: "+213",
    email: "contact@businessalgerie.com",
    address: {
      streetAddress: "",
      addressLocality: "Alger",
      addressRegion: "Alger",
      postalCode: "16000",
      addressCountry: "DZ",
    },
    geo: { latitude: 36.7538, longitude: 3.0588 },
    openingHours: ["Mo-Fr 09:00-17:00"],
    image: "/images/hero.webp",
    sameAs: [
      "https://facebook.com/businessalgerie",
      "https://instagram.com/businessalgerie",
      "https://linkedin.com/company/businessalgerie",
      "https://youtube.com/@businessalgerie",
    ],
    priceRange: "$$",
    areaServed: "Algérie",
    hasMap: "https://www.google.com/maps/search/?api=1&query=Alger,+Algérie",
  },
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
