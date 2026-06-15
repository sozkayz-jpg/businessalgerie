"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "uploads";
  if (!file) return { error: "No file provided" };

  const client = await createClient();
  const ext = file.name.split(".").pop()?.toLowerCase();
  const safeName = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await client.storage.from("media").upload(safeName, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { error: error.message };
  const { data: publicUrl } = client.storage.from("media").getPublicUrl(data.path);
  return { url: publicUrl.publicUrl };
}

export async function deleteFile(url: string) {
  const client = await createClient();
  const base = "media";
  const path = new URL(url).pathname.split(`/storage/v1/object/public/${base}/`).pop();
  if (!path) return { error: "Invalid URL" };
  const { error } = await client.storage.from(base).remove([path]);
  if (error) return { error: error.message };
  return { ok: true };
}
