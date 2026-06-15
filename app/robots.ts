import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://businessalgerie.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/member",
        "/checkout",
        "/api",
        "/_next",
        "/404",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
