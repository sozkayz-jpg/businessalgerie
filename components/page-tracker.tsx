"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getSessionId() {
  if (typeof window === "undefined") return null;
  let id = sessionStorage.getItem("ba_session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("ba_session_id", id);
  }
  return id;
}

function getUtmParams(search: string) {
  const params = new URLSearchParams(search);
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
  };
}

function Tracker({ locale }: { locale: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "pageview",
        path: pathname,
        locale,
        referrer: document.referrer || null,
        session_id: sessionId,
        ...getUtmParams(searchParams.toString()),
      }),
    });
  }, [pathname, searchParams, locale]);

  return null;
}

export function PageTracker({ locale }: { locale: string }) {
  return (
    <React.Suspense fallback={null}>
      <Tracker locale={locale} />
    </React.Suspense>
  );
}
