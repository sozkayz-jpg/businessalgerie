import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const { error: authError } = await requireAdmin(request);
  if (authError) {
    return Response.json({ ok: false, error: authError }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return Response.json({ ok: false, error: "invalid_form" }, { status: 400 });
  }

  const file = form.get("file") as File | null;
  if (!file) {
    return Response.json({ ok: false, error: "missing_file" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const { data, error } = await supabase.storage
    .from("media")
    .upload(`public/${filename}`, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (error || !data) {
    return Response.json({ ok: false, error: error?.message || "upload_failed" }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from("media").getPublicUrl(data.path);

  await supabase.from("media").insert({
    name: file.name,
    url: urlData.publicUrl,
    content_type: file.type,
    size: file.size,
  });

  return Response.json({ ok: true, url: urlData.publicUrl });
}
