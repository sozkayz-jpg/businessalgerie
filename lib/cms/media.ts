import { createAdminClient } from "@/lib/supabase/admin";
import type { MediaItem } from "./types";

export async function uploadMedia(
  file: File,
  path?: string
): Promise<{ url: string; error?: string }> {
  try {
    const supabase = createAdminClient();
    const filename = path || `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { data, error } = await supabase.storage
      .from("media")
      .upload(`public/${filename}`, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });

    if (error || !data) {
      console.error("uploadMedia error", error);
      return { url: "", error: error?.message || "Upload failed" };
    }

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(data.path);

    await supabase.from("media").insert({
      name: file.name,
      url: urlData.publicUrl,
      content_type: file.type,
      size: file.size,
    });

    return { url: urlData.publicUrl };
  } catch (err: any) {
    console.error("uploadMedia exception", err);
    return { url: "", error: err?.message || "Upload failed" };
  }
}

export async function getAllMedia(): Promise<MediaItem[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("getAllMedia error", error);
      return [];
    }
    return data as MediaItem[];
  } catch (err) {
    console.warn("getAllMedia error", err);
    return [];
  }
}
