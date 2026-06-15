import { createAdminClient } from "@/lib/supabase/admin";
import type { Page, Block, SeoMeta } from "./types";
import type { Locale } from "@/i18n/routing";

export type { Page } from "./types";

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !data) {
      console.warn(`getPageBySlug(${slug}) fallback`, error?.message);
      return null;
    }

    return data as Page;
  } catch (err) {
    console.warn(`getPageBySlug(${slug}) error`, err);
    return null;
  }
}

export async function getAllPages(): Promise<Page[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("published", true)
      .order("slug", { ascending: true });

    if (error || !data) {
      console.warn("getAllPages fallback", error?.message);
      return [];
    }

    return data as Page[];
  } catch (err) {
    console.warn("getAllPages error", err);
    return [];
  }
}

export async function getAllPageSlugs(): Promise<string[]> {
  const pages = await getAllPages();
  return pages.map((p) => p.slug);
}

export async function createPage(
  page: Omit<Page, "id" | "created_at" | "updated_at">
): Promise<Page | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("pages").insert(page).select().single();
  if (error) {
    console.error("createPage error", error);
    return null;
  }
  return data as Page;
}

export async function updatePage(
  id: string,
  updates: Partial<Omit<Page, "id" | "created_at" | "updated_at">>
): Promise<Page | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("pages")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("updatePage error", error);
    return null;
  }
  return data as Page;
}

export async function deletePage(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("pages").delete().eq("id", id);
  if (error) {
    console.error("deletePage error", error);
    return false;
  }
  return true;
}

export function getPageMeta(page: Page, locale: Locale): SeoMeta {
  return page.meta[locale] || {};
}

export function getPageBlocks(page: Page, locale: Locale): Block[] {
  return page.blocks[locale] || [];
}
