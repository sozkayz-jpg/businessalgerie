import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const locales = ["fr", "ar", "en"] as const;
type Locale = (typeof locales)[number];

function loadMessages(locale: Locale) {
  const file = path.join(process.cwd(), "messages", `${locale}.json`);
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

const messages: Record<Locale, any> = {
  fr: loadMessages("fr"),
  ar: loadMessages("ar"),
  en: loadMessages("en"),
};

function perLocale<T>(getter: (m: any, locale: Locale) => T): Record<Locale, T> {
  return {
    fr: getter(messages.fr, "fr"),
    ar: getter(messages.ar, "ar"),
    en: getter(messages.en, "en"),
  };
}

async function seedSiteSettings() {
  const brandName = perLocale((m) => m.brand?.name || "Business Algerie");
  const tagline = perLocale(
    (m) =>
      m.brand?.tagline ||
      "Formations et accompagnement marketing digital en Algérie."
  );

  const { error } = await supabase.from("site_settings").upsert(
    {
      id: "default",
      brand_name: brandName,
      tagline,
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
        description: tagline.fr,
        keywords: [
          "marketing digital",
          "Algérie",
          "e-commerce",
          "formation",
          "site web",
        ],
        ogImageUrl: "/images/hero.webp",
      },
      social_links: {
        facebook: "https://facebook.com/businessalgerie",
        instagram: "https://instagram.com/businessalgerie",
        linkedin: "https://linkedin.com/company/businessalgerie",
        youtube: "https://youtube.com/@businessalgerie",
      },
      pixels: { facebook: null, tiktok: null, linkedin: null },
      analytics: { ga4MeasurementId: null, searchConsoleHtmlTag: null },
      local_business: {
        name: "Business Algerie",
        description: "Agence de marketing digital et formations pour entrepreneurs algériens.",
        url: "https://businessalgerie.vercel.app",
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
    },
    { onConflict: "id" }
  );

  if (error) throw error;
  console.log("Seeded site_settings");
}

function makeRichTextBlock(html: string) {
  return {
    type: "rich_text" as const,
    id: crypto.randomUUID(),
    props: {
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: html }],
          },
        ],
      },
    },
  };
}

function makeHeadingBlock(text: string, level: 1 | 2 | 3 = 2) {
  return {
    type: "heading" as const,
    id: crypto.randomUUID(),
    props: { level, text },
  };
}

function makeImageBlock(src: string, alt: string) {
  return {
    type: "image" as const,
    id: crypto.randomUUID(),
    props: { src, alt },
  };
}

async function seedPages() {
  const pages = [
    {
      slug: "home",
      is_system: true,
      meta: perLocale((m, locale) => ({
        title: m.brand?.name || "Business Algerie",
        description:
          m.brand?.tagline ||
          "Formations et accompagnement marketing digital en Algérie.",
        keywords: ["marketing digital", "Algérie", "e-commerce", "formation"],
      })),
      blocks: perLocale((m, locale) => {
        const h = m.home;
        return [
          {
            type: "hero",
            id: crypto.randomUUID(),
            props: {
              eyebrow: h?.hero?.eyebrow || "",
              title: h?.hero?.title || "",
              subtitle: h?.hero?.subtitle || "",
              ctaPrimary: h?.hero?.cta_primary || "",
              ctaPrimaryHref: "/formations",
              ctaSecondary: h?.hero?.cta_secondary || "",
              ctaSecondaryHref: "/contact",
              videoHint: h?.hero?.video_hint || "",
              image: "/images/hero.webp",
            },
          },
          {
            type: "problem",
            id: crypto.randomUUID(),
            props: {
              eyebrow: h?.problem?.eyebrow || "",
              title: h?.problem?.title || "",
              subtitle: h?.problem?.subtitle || "",
              items: h?.problem?.items || [],
            },
          },
          {
            type: "solution",
            id: crypto.randomUUID(),
            props: {
              eyebrow: h?.solution?.eyebrow || "",
              title: h?.solution?.title || "",
              subtitle: h?.solution?.subtitle || "",
              items: h?.solution?.items || [],
              ctaPrimary: h?.solution?.cta_primary || "",
              ctaSecondary: h?.solution?.cta_secondary || "",
            },
          },
          {
            type: "courses_preview",
            id: crypto.randomUUID(),
            props: {
              eyebrow: h?.courses_preview?.eyebrow || "",
              title: h?.courses_preview?.title || "",
              subtitle: h?.courses_preview?.subtitle || "",
              ctaAll: h?.courses_preview?.cta_all || "",
              limit: 3,
            },
          },
          {
            type: "testimonials",
            id: crypto.randomUUID(),
            props: {
              eyebrow: h?.testimonials?.eyebrow || "",
              title: h?.testimonials?.title || "",
              items: h?.testimonials?.items || [],
            },
          },
          {
            type: "faq",
            id: crypto.randomUUID(),
            props: {
              eyebrow: h?.faq?.eyebrow || "",
              title: h?.faq?.title || "",
              items: h?.faq?.items || [],
            },
          },
          {
            type: "cta",
            id: crypto.randomUUID(),
            props: {
              title: h?.cta?.title || "",
              subtitle: h?.cta?.subtitle || "",
              ctaPrimary: h?.cta?.cta_primary || "",
              ctaSecondary: h?.cta?.cta_secondary || "",
            },
          },
          {
            type: "newsletter",
            id: crypto.randomUUID(),
            props: {
              title: h?.newsletter?.title || "",
              subtitle: h?.newsletter?.subtitle || "",
              placeholder: h?.newsletter?.placeholder || "",
              button: h?.newsletter?.button || "",
            },
          },
        ];
      }),
    },
    {
      slug: "agence",
      is_system: true,
      meta: perLocale((m, locale) => ({
        title: m.pages?.agence?.title || "Agence",
        description: m.pages?.agence?.intro || "",
      })),
      blocks: perLocale((m, locale) => {
        const p = m.pages?.agence;
        return [
          makeHeadingBlock(p?.title || "Agence", 1),
          makeRichTextBlock(p?.intro || ""),
          {
            type: "services_grid",
            id: crypto.randomUUID(),
            props: { services: p?.services || [] },
          },
          {
            type: "button",
            id: crypto.randomUUID(),
            props: { text: p?.cta || "Discuter", href: "/contact", variant: "primary" },
          },
        ];
      }),
    },
    {
      slug: "services",
      is_system: true,
      meta: perLocale((m, locale) => ({
        title: m.pages?.services?.title || "Services",
        description: m.pages?.services?.intro || "",
      })),
      blocks: perLocale((m, locale) => {
        const p = m.pages?.services;
        return [
          makeHeadingBlock(p?.title || "Services", 1),
          makeRichTextBlock(p?.intro || ""),
          {
            type: "services_cards",
            id: crypto.randomUUID(),
            props: { items: p?.items || [] },
          },
          {
            type: "button",
            id: crypto.randomUUID(),
            props: { text: p?.cta || "Demander un devis", href: "/contact", variant: "primary" },
          },
        ];
      }),
    },
    {
      slug: "a-propos",
      is_system: true,
      meta: perLocale((m, locale) => ({
        title: m.pages?.about?.title || "À propos",
        description: m.pages?.about?.mission?.desc || "",
      })),
      blocks: perLocale((m, locale) => {
        const p = m.pages?.about;
        return [
          makeHeadingBlock(p?.title || "À propos", 1),
          makeHeadingBlock(p?.mission?.title || "Mission", 2),
          makeRichTextBlock(p?.mission?.desc || ""),
          makeHeadingBlock(p?.story?.title || "Histoire", 2),
          makeRichTextBlock(p?.story?.desc || ""),
          makeHeadingBlock(p?.team?.title || "Équipe", 2),
          makeRichTextBlock(p?.team?.desc || ""),
          {
            type: "button",
            id: crypto.randomUUID(),
            props: { text: p?.cta || "Nous contacter", href: "/contact", variant: "primary" },
          },
        ];
      }),
    },
    {
      slug: "contact",
      is_system: true,
      meta: perLocale((m, locale) => ({
        title: m.pages?.contact?.title || "Contact",
        description: m.pages?.contact?.intro || "",
      })),
      blocks: perLocale((m, locale) => {
        const p = m.pages?.contact;
        return [
          makeHeadingBlock(p?.title || "Contact", 1),
          makeRichTextBlock(p?.intro || ""),
          { type: "contact_form", id: crypto.randomUUID(), props: {} },
        ];
      }),
    },
    {
      slug: "formations",
      is_system: true,
      meta: perLocale((m, locale) => ({
        title: m.pages?.formations?.title || "Formations",
        description: m.pages?.formations?.intro || "",
      })),
      blocks: perLocale((m, locale) => {
        const p = m.pages?.formations;
        return [
          makeHeadingBlock(p?.title || "Formations", 1),
          makeRichTextBlock(p?.intro || ""),
          { type: "courses_grid", id: crypto.randomUUID(), props: {} },
        ];
      }),
    },
    {
      slug: "mentions-legales",
      is_system: true,
      meta: perLocale((m, locale) => ({
        title: m.pages?.mentionsLegales?.title || "Mentions légales",
        description: "",
      })),
      blocks: perLocale((m, locale) => [
        makeHeadingBlock(messages[locale].pages?.mentionsLegales?.title || "Mentions légales", 1),
        makeRichTextBlock(messages[locale].pages?.mentionsLegales?.content || ""),
      ]),
    },
    {
      slug: "confidentialite",
      is_system: true,
      meta: perLocale((m, locale) => ({
        title: m.pages?.confidentialite?.title || "Confidentialité",
        description: "",
      })),
      blocks: perLocale((m, locale) => [
        makeHeadingBlock(messages[locale].pages?.confidentialite?.title || "Confidentialité", 1),
        makeRichTextBlock(messages[locale].pages?.confidentialite?.content || ""),
      ]),
    },
  ];

  for (const page of pages) {
    const { error } = await supabase
      .from("pages")
      .upsert(page, { onConflict: "slug" });
    if (error) throw error;
    console.log(`Seeded page ${page.slug}`);
  }
}

async function seedBlogPosts() {
  const slugs = [
    "risque-facebook",
    "independance-digitale",
    "premier-site-web",
    "e-commerce-algerie",
  ];

  const posts = slugs.map((slug) => {
    const postFr = messages.fr.blog?.posts?.[slug] || messages.fr.BLOG_POSTS?.find((p: any) => p.slug === slug);
    const existingFr = messages.fr.BLOG_POSTS?.find((p: any) => p.slug === slug);
    const existingAr = messages.ar.BLOG_POSTS?.find((p: any) => p.slug === slug);
    const existingEn = messages.en.BLOG_POSTS?.find((p: any) => p.slug === slug);

    const get = (p: any) => p || { title: slug, excerpt: "", category: "Blog", date: "2026-06-15", readingTime: 5 };

    const fr = get(existingFr);
    const ar = get(existingAr);
    const en = get(existingEn);

    const images: Record<string, string> = {
      "risque-facebook": "/images/blog-risque-facebook.webp",
      "independance-digitale": "/images/blog-independance-digitale.webp",
      "premier-site-web": "/images/blog-premier-site-web.webp",
      "e-commerce-algerie": "/images/blog-e-commerce-algerie.webp",
    };

    return {
      slug,
      status: "published",
      published_at: new Date(fr.date).toISOString(),
      author: "Business Algerie",
      category: { fr: fr.category, ar: ar.category, en: en.category },
      reading_time: fr.readingTime,
      image: images[slug],
      video_id: fr.videoId || null,
      title: { fr: fr.title, ar: ar.title, en: en.title },
      excerpt: { fr: fr.excerpt, ar: ar.excerpt, en: en.excerpt },
      content: {
        fr: [makeRichTextBlock(fr.excerpt)],
        ar: [makeRichTextBlock(ar.excerpt)],
        en: [makeRichTextBlock(en.excerpt)],
      },
      meta: {
        fr: { title: fr.title, description: fr.excerpt },
        ar: { title: ar.title, description: ar.excerpt },
        en: { title: en.title, description: en.excerpt },
      },
      seo_score: null,
    };
  });

  for (const post of posts) {
    const { error } = await supabase
      .from("blog_posts")
      .upsert(post, { onConflict: "slug" });
    if (error) throw error;
    console.log(`Seeded blog post ${post.slug}`);
  }
}

async function seedCourses() {
  const courseSlugs = ["facebook-to-website", "woocommerce-ecommerce", "copywriting-algerie", "trafic-publicites"];

  const courses = courseSlugs.map((slug) => {
    const existingFr = messages.fr.COURSES?.find((c: any) => c.slug === slug);
    const existingAr = messages.ar.COURSES?.find((c: any) => c.slug === slug);
    const existingEn = messages.en.COURSES?.find((c: any) => c.slug === slug);

    const get = (c: any) =>
      c || {
        slug,
        title: { fr: slug, ar: slug, en: slug },
        priceDZD: 0,
        isFlagship: false,
        image: `/images/${slug}.webp`,
      };

    const fr = get(existingFr);
    const ar = get(existingAr);
    const en = get(existingEn);

    const detailFr = messages.fr.courseDetails?.[slug];

    return {
      slug,
      title: { fr: fr.title?.fr || fr.title, ar: ar.title?.ar || ar.title, en: en.title?.en || en.title },
      price_dzd: fr.priceDZD,
      is_flagship: !!fr.isFlagship,
      image: `/images/${slug}.webp`,
      description: { fr: detailFr?.description || "", ar: "", en: "" },
      learn: { fr: detailFr?.learn || [], ar: [], en: [] },
      program: { fr: detailFr?.program || [], ar: [], en: [] },
      meta: {
        fr: { title: fr.title?.fr || fr.title, description: detailFr?.description || "" },
        ar: { title: ar.title?.ar || ar.title, description: "" },
        en: { title: en.title?.en || en.title, description: "" },
      },
      published: true,
    };
  });

  for (const course of courses) {
    const { error } = await supabase
      .from("courses")
      .upsert(course, { onConflict: "slug" });
    if (error) throw error;
    console.log(`Seeded course ${course.slug}`);
  }
}

async function main() {
  await seedSiteSettings();
  await seedPages();
  await seedBlogPosts();
  await seedCourses();
  console.log("CMS seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
