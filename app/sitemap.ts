import type { MetadataRoute } from "next";

export const dynamic = "force-static";

import { routing, type Locale } from "@/i18n/routing";
import { getAllPageSlugs } from "@/lib/cms/pages";
import { getAllPostSlugs } from "@/lib/cms/posts";
import { getAllCourseSlugs } from "@/lib/cms/courses";
import { STATIC_POSTS } from "@/lib/blog";
import { STATIC_COURSES } from "@/lib/courses";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://businessalgerie.com";

const STATIC_SLUGS: { slug: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { slug: "", priority: 1.0, changeFrequency: "weekly" },
  { slug: "agence", priority: 0.7, changeFrequency: "monthly" },
  { slug: "a-propos", priority: 0.7, changeFrequency: "monthly" },
  { slug: "services", priority: 0.8, changeFrequency: "weekly" },
  { slug: "contact", priority: 0.6, changeFrequency: "monthly" },
  { slug: "formations", priority: 0.9, changeFrequency: "weekly" },
  { slug: "blog", priority: 0.8, changeFrequency: "weekly" },
  { slug: "mentions-legales", priority: 0.3, changeFrequency: "yearly" },
  { slug: "confidentialite", priority: 0.3, changeFrequency: "yearly" },
  { slug: "merci", priority: 0.4, changeFrequency: "yearly" },
];

// Slugs réservés qui ne correspondent pas à des routes publiques existantes.
const EXCLUDED_PAGE_SLUGS = new Set(["home"]);

function buildUrl(locale: Locale, slug: string): string {
  const path = slug ? `/${locale}/${slug}` : `/${locale}`;
  return `${siteUrl}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [cmsPages, cmsPosts, cmsCourses] = await Promise.all([
    getAllPageSlugs(),
    getAllPostSlugs(),
    getAllCourseSlugs(),
  ]);

  // Fallback sur les données statiques si le CMS n'est pas peuplé.
  const postSlugs = [...new Set([...cmsPosts, ...STATIC_POSTS.map((p) => p.slug)])];
  const courseSlugs = [...new Set([...cmsCourses, ...STATIC_COURSES.map((c) => c.slug)])];

  const entries: MetadataRoute.Sitemap = [];

  // Pages statiques publiques
  for (const locale of routing.locales) {
    for (const { slug, priority, changeFrequency } of STATIC_SLUGS) {
      entries.push({
        url: buildUrl(locale, slug),
        lastModified: now,
        changeFrequency,
        priority,
      });
    }
  }

  // Pages CMS publiques (uniquement si elles ne sont pas déjà hardcodées).
  for (const locale of routing.locales) {
    for (const slug of cmsPages) {
      if (!slug || EXCLUDED_PAGE_SLUGS.has(slug)) continue;
      if (STATIC_SLUGS.some((s) => s.slug === slug)) continue;
      entries.push({
        url: buildUrl(locale, slug),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Articles de blog
  for (const locale of routing.locales) {
    for (const slug of postSlugs) {
      entries.push({
        url: buildUrl(locale, `blog/${slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Formations
  for (const locale of routing.locales) {
    for (const slug of courseSlugs) {
      entries.push({
        url: buildUrl(locale, `formations/${slug}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
