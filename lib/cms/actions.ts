"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  SiteSettings,
  Page,
  BlogPost,
  Course,
  Order,
  MediaFile,
} from "@/lib/cms/types";
import { getAdminUser } from "@/lib/auth";

// ---------- SiteSettings ----------
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const client = await createClient();
  const { data } = await client.from("site_settings").select("*").single();
  return data as SiteSettings | null;
}

export async function updateSiteSettings(values: Partial<SiteSettings>) {
  const admin = await getAdminUser();
  if (!admin) return { error: "Non autorisé" };
  const client = await createClient();
  const { data: existing } = await client.from("site_settings").select("id").single();
  const id = existing?.id;
  const { error } = id
    ? await client.from("site_settings").update(values).eq("id", id)
    : await client.from("site_settings").insert(values);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/(fr|ar|en)");
  return { ok: true };
}

// ---------- Pages ----------
export async function listPages(locale?: string) {
  const client = await createClient();
  let q = client.from("pages").select("*").order("updated_at", { ascending: false });
  if (locale) q = q.eq("locale", locale);
  const { data, error } = await q;
  return { data, error: error?.message };
}

export async function getPage(id: string) {
  const client = await createClient();
  const { data, error } = await client.from("pages").select("*").eq("id", id).single();
  return { data, error: error?.message };
}

export async function savePage(page: Partial<Page>) {
  const admin = await getAdminUser();
  if (!admin) return { error: "Non autorisé" };
  const client = await createClient();
  const { error } = page.id
    ? await client.from("pages").update(page).eq("id", page.id)
    : await client.from("pages").insert(page);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}

export async function deletePage(id: string) {
  const admin = await getAdminUser();
  if (!admin) return { error: "Non autorisé" };
  const client = await createClient();
  const { error } = await client.from("pages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { ok: true };
}

// ---------- Blog posts ----------
export async function listPosts(locale?: string, status?: string) {
  const client = await createClient();
  let q = client.from("blog_posts").select("*").order("published_at", { ascending: false });
  if (locale) q = q.eq("locale", locale);
  if (status) q = q.eq("status", status);
  const { data, error } = await q;
  return { data, error: error?.message };
}

export async function getPost(id: string) {
  const client = await createClient();
  const { data, error } = await client.from("blog_posts").select("*").eq("id", id).single();
  return { data, error: error?.message };
}

export async function savePost(post: Partial<BlogPost>) {
  const admin = await getAdminUser();
  if (!admin) return { error: "Non autorisé" };
  const client = await createClient();
  const { error } = post.id
    ? await client.from("blog_posts").update(post).eq("id", post.id)
    : await client.from("blog_posts").insert(post);
  if (error) return { error: error.message };
  revalidatePath("/fr/blog");
  return { ok: true };
}

export async function deletePost(id: string) {
  const admin = await getAdminUser();
  if (!admin) return { error: "Non autorisé" };
  const client = await createClient();
  const { error } = await client.from("blog_posts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/fr/blog");
  return { ok: true };
}

// ---------- Courses ----------
export async function listCourses(locale?: string, status?: string) {
  const client = await createClient();
  let q = client.from("courses").select("*").order("updated_at", { ascending: false });
  if (locale) q = q.eq("locale", locale);
  if (status) q = q.eq("status", status);
  const { data, error } = await q;
  return { data, error: error?.message };
}

export async function getCourse(id: string) {
  const client = await createClient();
  const { data, error } = await client.from("courses").select("*").eq("id", id).single();
  return { data, error: error?.message };
}

export async function saveCourse(course: Partial<Course>) {
  const admin = await getAdminUser();
  if (!admin) return { error: "Non autorisé" };
  const client = await createClient();
  const { error } = course.id
    ? await client.from("courses").update(course).eq("id", course.id)
    : await client.from("courses").insert(course);
  if (error) return { error: error.message };
  revalidatePath("/fr/formations");
  return { ok: true };
}

export async function deleteCourse(id: string) {
  const admin = await getAdminUser();
  if (!admin) return { error: "Non autorisé" };
  const client = await createClient();
  const { error } = await client.from("courses").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/fr/formations");
  return { ok: true };
}

// ---------- Orders ----------
export async function listOrders(status?: string) {
  const admin = await getAdminUser();
  if (!admin) return { error: "Non autorisé" };
  const client = createAdminClient();
  let q = client.from("orders").select("*").order("created_at", { ascending: false });
  if (status) q = q.eq("status", status);
  const { data, error } = await q;
  return { data, error: error?.message };
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  const admin = await getAdminUser();
  if (!admin) return { error: "Non autorisé" };
  const client = createAdminClient();
  const { error } = await client.from("orders").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  return { ok: true };
}

// ---------- SEO analyzer ----------
export async function analyzeSEO(input: {
  title: string;
  description: string;
  content: string;
  slug: string;
  locale: string;
  keywords: string;
}) {
  const { title, description, content, slug, keywords } = input;
  const text = content.replace(/<[^>]*>/g, " ");
  const checks = [] as Array<{
    name: string;
    passed: boolean;
    message: string;
    priority: "high" | "medium" | "low";
  }>;
  const suggestions: string[] = [];

  // Title
  const titleLen = title.length;
  const titleOk = titleLen >= 30 && titleLen <= 60;
  checks.push({
    name: "Balise title",
    passed: titleOk,
    message: `${titleLen} caractères (idéal 30-60)`,
    priority: "high",
  });
  if (!titleOk) suggestions.push("Ajustez la balise title entre 30 et 60 caractères.");

  // Meta description
  const descLen = description.length;
  const descOk = descLen >= 120 && descLen <= 160;
  checks.push({
    name: "Méta description",
    passed: descOk,
    message: `${descLen} caractères (idéal 120-160)`,
    priority: "high",
  });
  if (!descOk) suggestions.push("Écrivez une méta description entre 120 et 160 caractères.");

  // Keyword in title and first 100 words
  const keywordList = keywords
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);
  const lowerTitle = title.toLowerCase();
  const first100 = text.slice(0, 600).toLowerCase();
  for (const kw of keywordList) {
    const inTitle = lowerTitle.includes(kw);
    const inFirst100 = first100.includes(kw);
    checks.push({
      name: `Mot-clé « ${kw} »`,
      passed: inTitle && inFirst100,
      message: inTitle ? "Présent dans le title" : "Absent du title",
      priority: "high",
    });
    if (!inTitle) suggestions.push(`Intégrez « ${kw} » dans le title.`);
    if (!inFirst100) suggestions.push(`Intégrez « ${kw} » dans les 100 premiers mots.`);
  }

  // Content length
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const lengthOk = wordCount >= 300;
  checks.push({
    name: "Longueur du contenu",
    passed: lengthOk,
    message: `${wordCount} mots (minimum recommandé 300)`,
    priority: "medium",
  });
  if (!lengthOk) suggestions.push("Élargissez le contenu à au moins 300 mots.");

  // Slug
  const slugOk = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length < 80;
  checks.push({
    name: "URL / slug",
    passed: slugOk,
    message: slugOk ? "Slug propre" : "Slug trop long ou mal formaté",
    priority: "medium",
  });
  if (!slugOk) suggestions.push("Utilisez un slug court, sans accents ni espaces.");

  // Internal links
  const internalLinks = (content.match(/href=\"\/[^\"]*\"/g) || []).length;
  const linksOk = internalLinks >= 1;
  checks.push({
    name: "Liens internes",
    passed: linksOk,
    message: `${internalLinks} lien(s) interne(s)`,
    priority: "medium",
  });
  if (!linksOk) suggestions.push("Ajoutez au moins un lien interne vers une autre page.");

  // Headings
  const h2Count = (content.match(/<h2/gi) || []).length;
  const h3Count = (content.match(/<h3/gi) || []).length;
  const headingsOk = h2Count >= 1;
  checks.push({
    name: "Structure de titres",
    passed: headingsOk,
    message: `${h2Count} H2, ${h3Count} H3`,
    priority: "medium",
  });
  if (!headingsOk) suggestions.push("Ajoutez au moins un titre H2 pour structurer le contenu.");

  // Images alt
  const images = content.match(/<img[^>]*>/gi) || [];
  const missingAlt = images.filter((img) => !img.includes("alt=")).length;
  const imagesOk = images.length === 0 || missingAlt === 0;
  checks.push({
    name: "Attributs alt des images",
    passed: imagesOk,
    message: `${images.length - missingAlt}/${images.length} images avec alt`,
    priority: "medium",
  });
  if (!imagesOk) suggestions.push("Ajoutez des attributs alt descriptifs à vos images.");

  // Geo: mentions Algeria / city
  const geoTerms = ["alger", "algerie", "algeria", "oran", "constantine", "annaba"];
  const hasGeo = geoTerms.some((term) => text.toLowerCase().includes(term));
  const hasMap = content.toLowerCase().includes("schema.org") && content.includes("GeoCoordinates");
  checks.push({
    name: "Signaux géolocalisés",
    passed: hasGeo,
    message: hasGeo ? "Mentions locales détectées" : "Aucune mention locale",
    priority: "high",
  });
  if (!hasGeo) suggestions.push("Mentionnez une ville ou le pays cible pour le référencement local.");

  checks.push({
    name: "Données structurées locales",
    passed: hasMap,
    message: hasMap ? "GeoCoordinates présent" : "Schema.org LocalBusiness absent",
    priority: "medium",
  });
  if (!hasMap) suggestions.push("Injectez un schema.org LocalBusiness avec GeoCoordinates.");

  const score = Math.round((checks.filter((c) => c.passed).length / checks.length) * 100);
  const geoScore = Math.round(
    ((hasGeo ? 1 : 0) + (hasMap ? 1 : 0) + (titleOk ? 1 : 0) + (descOk ? 1 : 0)) / 4 * 100
  );

  return { score, geoScore, checks, suggestions };
}

// ---------- Stats ----------
export async function getStats(days = 30) {
  const admin = await getAdminUser();
  if (!admin) return { error: "Non autorisé" };
  const client = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data: views, error } = await client
    .from("page_views")
    .select("path, created_at, referrer, country")
    .gte("created_at", since.toISOString());
  if (error) return { error: error.message };

  const total = views?.length || 0;
  const byPath = {} as Record<string, number>;
  const byCountry = {} as Record<string, number>;
  for (const v of views || []) {
    byPath[v.path] = (byPath[v.path] || 0) + 1;
    byCountry[v.country || "Inconnu"] = (byCountry[v.country || "Inconnu"] || 0) + 1;
  }
  const topPages = Object.entries(byPath)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return { total, topPages, byCountry };
}

export async function trackPageView(path: string, referrer?: string) {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  // Lightweight geolocation via headers not available in server actions; store basic data.
  await client.from("page_views").insert({
    path,
    referrer: referrer || null,
    user_id: user?.id || null,
    country: null,
    city: null,
  });
}
