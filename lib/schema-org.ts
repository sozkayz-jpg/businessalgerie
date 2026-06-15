import type { SiteSettings } from "@/lib/cms/types";
import type { Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/env";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SchemaOrgThing = Record<string, any>;

export function buildOrganizationSchema(settings: SiteSettings): SchemaOrgThing {
  const lb = settings.local_business;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: lb.name,
    description: lb.description,
    url: lb.url,
    logo: settings.logo_url || lb.image,
    image: lb.image,
    telephone: lb.telephone,
    email: lb.email,
    sameAs: lb.sameAs,
    address: {
      "@type": "PostalAddress",
      streetAddress: lb.address.streetAddress,
      addressLocality: lb.address.addressLocality,
      addressRegion: lb.address.addressRegion,
      postalCode: lb.address.postalCode,
      addressCountry: lb.address.addressCountry,
    },
    areaServed: lb.areaServed,
    priceRange: lb.priceRange,
  };
}

export function buildLocalBusinessSchema(settings: SiteSettings): SchemaOrgThing {
  const lb = settings.local_business;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: lb.name,
    description: lb.description,
    url: lb.url,
    image: lb.image,
    telephone: lb.telephone,
    email: lb.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: lb.address.streetAddress,
      addressLocality: lb.address.addressLocality,
      addressRegion: lb.address.addressRegion,
      postalCode: lb.address.postalCode,
      addressCountry: lb.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: lb.geo.latitude,
      longitude: lb.geo.longitude,
    },
    openingHoursSpecification: lb.openingHours.map((oh) => {
      const [days, hours] = oh.split(" ");
      const [opens, closes] = hours.split("-");
      return { "@type": "OpeningHoursSpecification", dayOfWeek: days.split(","), opens, closes };
    }),
    hasMap: lb.hasMap,
    sameAs: lb.sameAs,
    priceRange: lb.priceRange,
    areaServed: lb.areaServed,
  };
}

export function buildWebsiteSchema(settings: SiteSettings): SchemaOrgThing {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.brand_name.fr,
    url: settings.local_business.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${settings.local_business.url}/fr/formations?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; item: string }>
): SchemaOrgThing {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

export function buildCourseSchema(course: {
  title: string;
  description: string;
  slug: string;
  priceDZD: number;
  image?: string;
  locale: Locale;
}): SchemaOrgThing {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "Business Algerie",
      sameAs: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: course.priceDZD,
      priceCurrency: "DZD",
      availability: "https://schema.org/InStock",
    },
    image: course.image ? `${SITE_URL}${course.image}` : undefined,
    url: `${SITE_URL}/${course.locale}/formations/${course.slug}`,
    inLanguage: course.locale,
  };
}

export function buildBlogPostingSchema(post: {
  title: string;
  excerpt: string;
  slug: string;
  image?: string;
  date: string;
  author: string;
  locale: Locale;
  category: string;
}): SchemaOrgThing {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image ? `${SITE_URL}${post.image}` : undefined,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Business Algerie",
      logo: `${SITE_URL}/images/hero.webp`,
    },
    articleSection: post.category,
    inLanguage: post.locale,
    url: `${SITE_URL}/${post.locale}/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${post.locale}/blog/${post.slug}`,
    },
  };
}

export function buildFAQSchema(faqs: Array<{ question: string; answer: string }>): SchemaOrgThing {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildContactPageSchema(): SchemaOrgThing {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Business Algerie",
    url: `${SITE_URL}/fr/contact`,
  };
}
