export type BlogPost = {
  slug: string;
  title: Record<"fr" | "ar" | "en", string>;
  excerpt: Record<"fr" | "ar" | "en", string>;
  date: string;
  category: Record<"fr" | "ar" | "en", string>;
  readingTime: number;
  videoId?: string;
  image?: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "risque-facebook",
    title: {
      fr: "Pourquoi compter uniquement sur Facebook est un risque pour votre business",
      ar: "لماذا الاعتماد الكامل على فيسبوك يُشكّل خطرًا على عملك",
      en: "Why relying only on Facebook is a risk for your business",
    },
    excerpt: {
      fr: "Les algorithmes changent, les comptes peuvent être suspendus et l'audience ne vous appartient pas. Voici comment diversifier votre présence en ligne.",
      ar: "تتغيّر الخوارزميات، وقد تُعلق الحسابات، والجمهور ليس ملكك. إليك كيفية تنويع حضورك على الإنترنت.",
      en: "Algorithms change, accounts can be suspended, and the audience isn't yours. Here's how to diversify your online presence.",
    },
    date: "2026-05-12",
    category: {
      fr: "Stratégie digitale",
      ar: "استراتيجية رقمية",
      en: "Digital strategy",
    },
    readingTime: 5,
    videoId: "dQw4w9WgXcQ",
    image: "/images/blog-risque-facebook.webp",
  },
  {
    slug: "independance-digitale",
    title: {
      fr: "Indépendance digitale : construire des actifs que vous contrôlez",
      ar: "الاستقلالية الرقمية: بناء أصول تتحكم فيها",
      en: "Digital independence: building assets you control",
    },
    excerpt: {
      fr: "Site web, liste d'emails, contenu propre : découvrez les piliers d'une entreprise résiliente face aux plateformes tierces.",
      ar: "الموقع الإلكتروني، قائمة البريد، المحتوى الخاص: اكتشف ركائز شركة مرنة تجاه المنصات الخارجية.",
      en: "Website, email list, owned content: discover the pillars of a resilient business against third-party platforms.",
    },
    date: "2026-05-19",
    category: {
      fr: "Autonomie",
      ar: "استقلالية",
      en: "Independence",
    },
    readingTime: 6,
    videoId: "dQw4w9WgXcQ",
    image: "/images/blog-independance-digitale.webp",
  },
  {
    slug: "premier-site-web",
    title: {
      fr: "Votre premier site web : par où commencer en Algérie ?",
      ar: "موقعك الإلكتروني الأول: من أين تبدأ في الجزائر؟",
      en: "Your first website: where to start in Algeria?",
    },
    excerpt: {
      fr: "Nom de domaine, hébergement, design, contenu : un guide pratique pour lancer un site web professionnel sans se perdre.",
      ar: "اسم النطاق، الاستضافة، التصميم، المحتوى: دليل عملي لإطلاق موقع إلكتروني احترافي دون ضياع.",
      en: "Domain name, hosting, design, content: a practical guide to launching a professional website without getting lost.",
    },
    date: "2026-06-02",
    category: {
      fr: "Création web",
      ar: "إنشاء الويب",
      en: "Web creation",
    },
    readingTime: 7,
    videoId: "dQw4w9WgXcQ",
    image: "/images/blog-premier-site-web.webp",
  },
  {
    slug: "e-commerce-algerie",
    title: {
      fr: "E-commerce en Algérie : opportunités et bonnes pratiques",
      ar: "التجارة الإلكترونية في الجزائر: الفرص والممارسات الجيدة",
      en: "E-commerce in Algeria: opportunities and best practices",
    },
    excerpt: {
      fr: "Paiement à la livraison, logistique, confiance client : les clés pour vendre en ligne efficacement sur le marché algérien.",
      ar: "الدفع عند الاستلام، اللوجستيك، ثقة العملاء: مفاتيح البيع الفعّال عبر الإنترنت في السوق الجزائرية.",
      en: "Cash on delivery, logistics, customer trust: the keys to selling online effectively in the Algerian market.",
    },
    date: "2026-06-10",
    category: {
      fr: "E-commerce",
      ar: "تجارة إلكترونية",
      en: "E-commerce",
    },
    readingTime: 6,
    videoId: "dQw4w9WgXcQ",
    image: "/images/blog-e-commerce-algerie.webp",
  },
];

export function getAllBlogPosts(): BlogPost[] {
  return BLOG_POSTS;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
