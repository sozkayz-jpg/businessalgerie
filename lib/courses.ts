import {
  getAllCourses as getAllCmsCourses,
  getCourseBySlug as getCmsCourseBySlug,
  getFlagshipCourse as getCmsFlagshipCourse,
  formatPriceDZD as formatCmsPriceDZD,
  getCourseTitle,
} from "./cms/courses";
import type { Course as CmsCourse } from "./cms/courses";

export type Course = {
  slug: string;
  title: Record<"fr" | "ar" | "en", string>;
  priceDZD: number;
  isFlagship?: boolean;
  image?: string;
};

export const STATIC_COURSES: Course[] = [
  {
    slug: "facebook-to-website",
    title: {
      fr: "De Facebook au site web : maîtrise ton business",
      ar: "من فيسبوك إلى الموقع الإلكتروني: احكم بعملك",
      en: "From Facebook to Website: Own Your Business",
    },
    priceDZD: 24900,
    isFlagship: true,
    image: "/images/facebook-to-website.webp",
  },
  {
    slug: "woocommerce-ecommerce",
    title: {
      fr: "Créer un site e-commerce avec WordPress/WooCommerce",
      ar: "إنشاء متجر إلكتروني بوردبريس/ووكومرس",
      en: "Build an E-commerce Site with WordPress/WooCommerce",
    },
    priceDZD: 19900,
    image: "/images/woocommerce-ecommerce.webp",
  },
  {
    slug: "copywriting-algerie",
    title: {
      fr: "Copywriting & contenu qui vend",
      ar: "كتابة المحتوى والإعلانات التي تبيع",
      en: "Copywriting & Content That Sells",
    },
    priceDZD: 14900,
    image: "/images/copywriting-algerie.webp",
  },
  {
    slug: "trafic-publicites",
    title: {
      fr: "Trafic & publicités : devenir autonome en acquisition",
      ar: "الحركة والإعلانات: كن مستقلاً في الجذب",
      en: "Traffic & Ads: Become Independent in Acquisition",
    },
    priceDZD: 14900,
    image: "/images/trafic-publicites.webp",
  },
];

function mapCmsCourse(course: CmsCourse): Course {
  return {
    slug: course.slug,
    title: course.title,
    priceDZD: course.price_dzd,
    isFlagship: course.is_flagship,
    image: course.image || undefined,
  };
}

export async function getAllCourses(): Promise<Course[]> {
  const cms = await getAllCmsCourses();
  if (cms.length > 0) return cms.map(mapCmsCourse);
  return STATIC_COURSES;
}

export function getAllCoursesSync(): Course[] {
  return STATIC_COURSES;
}

export async function getFlagshipCourse(): Promise<Course | undefined> {
  const cms = await getCmsFlagshipCourse();
  if (cms) return mapCmsCourse(cms);
  return STATIC_COURSES.find((c) => c.isFlagship);
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const cms = await getCmsCourseBySlug(slug);
  if (cms) return mapCmsCourse(cms);
  return STATIC_COURSES.find((c) => c.slug === slug);
}

export function formatPriceDZD(price: number, locale: string): string {
  return formatCmsPriceDZD(price, locale);
}
