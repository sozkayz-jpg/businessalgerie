export type Course = {
  slug: string;
  title: Record<"fr" | "ar" | "en", string>;
  priceDZD: number;
  isFlagship?: boolean;
  image?: string;
};

export const COURSES: Course[] = [
  {
    slug: "facebook-to-website",
    title: {
      fr: "De Facebook au site web : maîtrise ton business",
      ar: "من فيسبوك إلى الموقع الإلكتروني: احكم بعملك",
      en: "From Facebook to Website: Own Your Business",
    },
    priceDZD: 24900,
    isFlagship: true,
    image: "/images/facebook-to-website.svg",
  },
  {
    slug: "woocommerce-ecommerce",
    title: {
      fr: "Créer un site e-commerce avec WordPress/WooCommerce",
      ar: "إنشاء متجر إلكتروني بوردبريس/ووكومرس",
      en: "Build an E-commerce Site with WordPress/WooCommerce",
    },
    priceDZD: 19900,
    image: "/images/woocommerce-ecommerce.svg",
  },
  {
    slug: "copywriting-algerie",
    title: {
      fr: "Copywriting & contenu qui vend",
      ar: "كتابة المحتوى والإعلانات التي تبيع",
      en: "Copywriting & Content That Sells",
    },
    priceDZD: 14900,
    image: "/images/copywriting-algerie.svg",
  },
  {
    slug: "trafic-publicites",
    title: {
      fr: "Trafic & publicités : devenir autonome en acquisition",
      ar: "الحركة والإعلانات: كن مستقلاً في الجذب",
      en: "Traffic & Ads: Become Independent in Acquisition",
    },
    priceDZD: 14900,
    image: "/images/trafic-publicites.svg",
  },
];

export function getAllCourses(): Course[] {
  return COURSES;
}

export function getFlagshipCourse(): Course | undefined {
  return COURSES.find((course) => course.isFlagship);
}

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((course) => course.slug === slug);
}

export function formatPriceDZD(price: number, locale: string): string {
  const tag =
    locale === "ar" ? "ar-DZ" : locale === "en" ? "en-DZ" : "fr-DZ";
  return new Intl.NumberFormat(tag, {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(price);
}
