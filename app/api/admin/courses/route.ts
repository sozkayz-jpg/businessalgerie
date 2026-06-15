import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { error: authError } = await requireAdmin(request);
  if (authError) {
    return Response.json({ ok: false, error: authError }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  const supabase = createAdminClient();
  if (slug) {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error || !data) {
      return Response.json({ ok: false, error: error?.message || "not_found" }, { status: 404 });
    }
    return Response.json({ ok: true, course: data });
  }

  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, price_dzd, is_flagship, published, updated_at")
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return Response.json({ ok: false, error: error?.message }, { status: 500 });
  }
  return Response.json({ ok: true, courses: data });
}

export async function POST(request: NextRequest) {
  const { error: authError } = await requireAdmin(request);
  if (authError) {
    return Response.json({ ok: false, error: authError }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !body.slug) {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("courses")
    .insert(body)
    .select()
    .single();

  if (error || !data) {
    return Response.json({ ok: false, error: error?.message || "insert_failed" }, { status: 500 });
  }
  return Response.json({ ok: true, course: data }, { status: 201 });
}
