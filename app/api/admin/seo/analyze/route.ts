import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { analyzeSEO } from "@/lib/cms/seo-analyzer";
import type { Locale } from "@/i18n/routing";

export async function POST(request: NextRequest) {
  const { error: authError } = await requireAdmin(request);
  if (authError) {
    return Response.json({ ok: false, error: authError }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const { title, description, slug, keywords, blocks, locale } = body;
  const analysis = analyzeSEO(
    title || "",
    description || "",
    slug || "",
    Array.isArray(keywords) ? keywords : [],
    Array.isArray(blocks) ? blocks : [],
    (locale as Locale) || "fr"
  );

  return Response.json({ ok: true, analysis });
}
