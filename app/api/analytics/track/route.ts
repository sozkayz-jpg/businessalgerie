import { NextRequest } from "next/server";
import { trackPageView, trackEvent } from "@/lib/cms/analytics";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const sessionId = body.session_id || crypto.randomUUID();

  if (body.type === "pageview") {
    await trackPageView({
      path: body.path || "/",
      locale: body.locale || "fr",
      referrer: body.referrer || null,
      utm_source: body.utm_source || null,
      utm_medium: body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
      session_id: sessionId,
      user_agent: request.headers.get("user-agent"),
    });
  } else {
    await trackEvent({
      type: body.type || "event",
      path: body.path || null,
      payload: body.payload || {},
      session_id: sessionId,
    });
  }

  return Response.json({ ok: true, session_id: sessionId });
}
