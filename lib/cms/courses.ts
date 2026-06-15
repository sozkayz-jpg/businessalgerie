import { createAdminClient } from "@/lib/supabase/admin";
import type { Course, SeoMeta, CourseProgram } from "./types";
import type { Locale } from "@/i18n/routing";

export type { Course, CourseProgram } from "./types";

export async function getAllCourses(): Promise<Course[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: true });

    if (error || !data) {
      console.warn("getAllCourses CMS fallback", error?.message);
      return [];
    }

    return data as Course[];
  } catch (err) {
    console.warn("getAllCourses CMS error", err);
    return [];
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !data) {
      console.warn(`getCourseBySlug(${slug}) fallback`, error?.message);
      return null;
    }

    return data as Course;
  } catch (err) {
    console.warn(`getCourseBySlug(${slug}) error`, err);
    return null;
  }
}

export async function getFlagshipCourse(): Promise<Course | undefined> {
  const courses = await getAllCourses();
  return courses.find((c) => c.is_flagship);
}

export async function getAllCourseSlugs(): Promise<string[]> {
  const courses = await getAllCourses();
  return courses.map((c) => c.slug);
}

export async function getAllCoursesAdmin(): Promise<Course[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error || !data) {
    console.error("getAllCoursesAdmin error", error);
    return [];
  }
  return data as Course[];
}

export async function getCourseByIdAdmin(id: string): Promise<Course | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("getCourseByIdAdmin error", error);
    return null;
  }
  return data as Course;
}

export async function createCourse(
  course: Omit<Course, "id" | "created_at" | "updated_at">
): Promise<Course | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("courses")
    .insert(course)
    .select()
    .single();
  if (error) {
    console.error("createCourse error", error);
    return null;
  }
  return data as Course;
}

export async function updateCourse(
  id: string,
  updates: Partial<Omit<Course, "id" | "created_at" | "updated_at">>
): Promise<Course | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("courses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("updateCourse error", error);
    return null;
  }
  return data as Course;
}

export async function deleteCourse(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) {
    console.error("deleteCourse error", error);
    return false;
  }
  return true;
}

export function getCourseTitle(course: Course, locale: Locale): string {
  return course.title[locale] || course.title.en || course.title.fr || course.slug;
}

export function getCourseDescription(course: Course, locale: Locale): string {
  return course.description[locale] || course.description.en || course.description.fr || "";
}

export function getCourseMeta(course: Course, locale: Locale): SeoMeta {
  return course.meta[locale] || {};
}

export function formatPriceDZD(price: number, locale: string): string {
  const tag = locale === "ar" ? "ar-DZ" : locale === "en" ? "en-DZ" : "fr-DZ";
  return new Intl.NumberFormat(tag, { style: "decimal", maximumFractionDigits: 0 }).format(
    price
  );
}
