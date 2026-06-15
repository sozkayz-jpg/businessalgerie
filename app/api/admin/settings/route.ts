import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { error: authError } = await requireAdmin(request);
  if (authError) {
    return Response.json({ ok: false, error: authError }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "default")
    .single();

  if (error || !data) {
    return Response.json({ ok: false, error: error?.message || "not_found" }, { status: 500 });
  }

  return Response.json({ ok: true, settings: data });
}

export async function POST(request: NextRequest) {
  const { error: authError } = await requireAdmin(request);
  if (authError) {
    return Response.json({ ok: false, error: authError }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .upsert({ id: "default", ...body }, { onConflict: "id" })
    .select()
    .single();

  if (error || !data) {
    return Response.json({ ok: false, error: error?.message || "upsert_failed" }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/[locale]");

  return Response.json({ ok: true, settings: data });
}
