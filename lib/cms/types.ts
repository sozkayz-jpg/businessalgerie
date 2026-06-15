import type { Locale } from "@/i18n/routing";

export type Localized<T> = Record<Locale, T>;

export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  twitter?: string;
  tiktok?: string;
};

export type PixelIds = {
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
};

export type AnalyticsConfig = {
  ga4MeasurementId?: string;
  searchConsoleHtmlTag?: string;
};

export type LocalBusinessConfig = {
  name: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  openingHours: string[];
  image: string;
  sameAs: string[];
  priceRange: string;
  areaServed: string;
  hasMap: string;
};

export type SiteColors = {
  primary: string;
  accent: string;
  soft: string;
  text: string;
  background: string;
  foreground: string;
};

export type SiteSettings = {
  id: string;
  brand_name: Localized<string>;
  tagline: Localized<string>;
  logo_url: string | null;
  favicon_url: string | null;
  logo_width: number;
  logo_height: number;
  colors: SiteColors;
  fonts: { heading: string; body: string };
  seo_default: {
    titleTemplate: string;
    description: string;
    keywords: string[];
    ogImageUrl: string;
  };
  social_links: SocialLinks;
  pixels: PixelIds;
  analytics: AnalyticsConfig;
  local_business: LocalBusinessConfig;
  updated_at: string;
};

export type SeoMeta = {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  keywords?: string[];
  noIndex?: boolean;
  canonical?: string;
};

export type BlockType =
  | "heading"
  | "paragraph"
  | "rich_text"
  | "image"
  | "video"
  | "button"
  | "columns"
  | "quote"
  | "list"
  | "divider"
  | "faq"
  | "testimonial"
  | "course_grid"
  | "courses_preview"
  | "newsletter"
  | "contact_form"
  | "services_grid"
  | "services_cards"
  | "about_cards"
  | "blog_grid"
  | "hero"
  | "problem"
  | "solution"
  | "cta";

export type Block = {
  id: string;
  type: BlockType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
};

export type Page = {
  id: string;
  slug: string;
  is_system: boolean;
  meta: Localized<SeoMeta>;
  blocks: Localized<Block[]>;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogPostStatus = "draft" | "published" | "scheduled";

export type BlogPost = {
  id: string;
  slug: string;
  status: BlogPostStatus;
  published_at: string | null;
  author: string;
  category: Localized<string>;
  reading_time: number;
  image: string | null;
  video_id: string | null;
  title: Localized<string>;
  excerpt: Localized<string>;
  content: Localized<Block[]>;
  meta: Localized<SeoMeta>;
  seo_score: number | null;
  created_at: string;
  updated_at: string;
};

export type CourseProgram = {
  title: string;
  items: string[];
};

export type Course = {
  id: string;
  slug: string;
  title: Localized<string>;
  price_dzd: number;
  is_flagship: boolean;
  image: string | null;
  description: Localized<string>;
  learn: Localized<string[]>;
  program: Localized<CourseProgram[]>;
  meta: Localized<SeoMeta>;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type MediaItem = {
  id: string;
  name: string;
  url: string;
  content_type: string | null;
  size: number | null;
  created_at: string;
};

export type MediaFile = MediaItem;

export type OrderStatus = "pending" | "paid" | "validated" | "rejected";

export type Order = {
  id: string;
  course_slug: string;
  course_title: string;
  email: string;
  name: string;
  phone?: string;
  status: OrderStatus;
  amount: number;
  created_at: string;
};

export type PageView = {
  id: string;
  path: string;
  locale: Locale;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  session_id: string | null;
  user_agent: string | null;
  created_at: string;
};

export type AnalyticsEvent = {
  id: string;
  type: string;
  path: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>;
  session_id: string | null;
  created_at: string;
};

export type SeoAnalysis = {
  score: number;
  checks: SeoCheck[];
};

export type SeoCheck = {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  message: string;
  points: number;
};
