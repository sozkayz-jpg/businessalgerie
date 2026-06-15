import { createAdminClient } from "@/lib/supabase/admin";
import type { BlogPost, BlogPostStatus, SeoMeta, Block } from "./types";
import type { Locale } from "@/i18n/routing";

export type { BlogPost } from "./types";

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error || !data) {
      console.warn("getAllPosts fallback", error?.message);
      return [];
    }

    return data as BlogPost[];
  } catch (err) {
    console.warn("getAllPosts error", err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) {
      console.warn(`getPostBySlug(${slug}) fallback`, error?.message);
      return null;
    }

    return data as BlogPost;
  } catch (err) {
    console.warn(`getPostBySlug(${slug}) error`, err);
    return null;
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}

export async function getAllPostsAdmin(): Promise<BlogPost[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error || !data) {
    console.error("getAllPostsAdmin error", error);
    return [];
  }
  return data as BlogPost[];
}

export async function getPostByIdAdmin(id: string): Promise<BlogPost | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("getPostByIdAdmin error", error);
    return null;
  }
  return data as BlogPost;
}

export async function createPost(
  post: Omit<BlogPost, "id" | "created_at" | "updated_at">
): Promise<BlogPost | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(post)
    .select()
    .single();
  if (error) {
    console.error("createPost error", error);
    return null;
  }
  return data as BlogPost;
}

export async function updatePost(
  id: string,
  updates: Partial<Omit<BlogPost, "id" | "created_at" | "updated_at">>
): Promise<BlogPost | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("updatePost error", error);
    return null;
  }
  return data as BlogPost;
}

export async function deletePost(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) {
    console.error("deletePost error", error);
    return false;
  }
  return true;
}

export function getPostMeta(post: BlogPost, locale: Locale): SeoMeta {
  return post.meta[locale] || {};
}

export function getPostContent(post: BlogPost, locale: Locale): Block[] {
  return post.content[locale] || [];
}

export function getPostTitle(post: BlogPost, locale: Locale): string {
  return post.title[locale] || post.title.en || post.title.fr || post.slug;
}

export function getPostExcerpt(post: BlogPost, locale: Locale): string {
  return post.excerpt[locale] || post.excerpt.en || post.excerpt.fr || "";
}

export function getPostCategory(post: BlogPost, locale: Locale): string {
  return post.category[locale] || post.category.en || post.category.fr || "Blog";
}
