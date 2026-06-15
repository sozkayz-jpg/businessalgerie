import { createAdminClient } from "@/lib/supabase/admin";
import type { AnalyticsEvent, PageView } from "./types";

export async function trackPageView(view: Omit<PageView, "id" | "created_at">): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from("page_views").insert(view);
  } catch (err) {
    console.warn("trackPageView error", err);
  }
}

export async function trackEvent(
  event: Omit<AnalyticsEvent, "id" | "created_at">
): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from("events").insert(event);
  } catch (err) {
    console.warn("trackEvent error", err);
  }
}

export async function getPageViewsSummary(days = 30) {
  try {
    const supabase = createAdminClient();
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from("page_views")
      .select("path, locale, created_at, referrer, utm_source, utm_medium, utm_campaign")
      .gte("created_at", since.toISOString());

    if (error || !data) {
      console.error("getPageViewsSummary error", error);
      return [];
    }
    return data as PageView[];
  } catch (err) {
    console.warn("getPageViewsSummary error", err);
    return [];
  }
}

export async function getEventsSummary(days = 30, type?: string) {
  try {
    const supabase = createAdminClient();
    const since = new Date();
    since.setDate(since.getDate() - days);

    let query = supabase
      .from("events")
      .select("*")
      .gte("created_at", since.toISOString());
    if (type) query = query.eq("type", type);

    const { data, error } = await query;
    if (error || !data) {
      console.error("getEventsSummary error", error);
      return [];
    }
    return data as AnalyticsEvent[];
  } catch (err) {
    console.warn("getEventsSummary error", err);
    return [];
  }
}
