import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { ShareButtons } from "@/components/share-buttons";
import { getBlogPostBySlug, getAllBlogPosts, type BlogPost } from "@/lib/blog";
import { routing, type Locale } from "@/i18n/routing";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { SchemaOrg } from "@/components/schema-org";
import { buildBlogPostingSchema, buildBreadcrumbSchema } from "@/lib/schema-org";
import { buildPublicUrl } from "@/lib/env";

type ArticleSection = {
  heading: Record<Locale, string>;
  paragraphs: Record<Locale, string[]>;
};

type ArticleContent = {
  intro: Record<Locale, string[]>;
  sections: ArticleSection[];
  videoHeading?: Record<Locale, string>;
};

const ARTICLES: Record<BlogPost["slug"], ArticleContent> = {
  "risque-facebook": {
    intro: {
      fr: [
        "De nombreux entrepreneurs algériens ont construit leur activité presque entièrement sur Facebook. C'est compréhensible : la plateforme est gratuite, massive et immédiate. Pourtant, cette dépendance cache un risque réel.",
        "Un algorithme, une décision de modération ou une suspension de compte peuvent faire disparaître du jour au lendemain l'accès à votre audience. Voici pourquoi il est temps de diversifier votre présence en ligne.",
      ],
      ar: [
        "بنى العديد من رياديي الأعمال الجزائريين نشاطهم بالكامل تقريبًا على فيسبوك. هذا مفهوم: المنصة مجانية وضخمة وفورية. لكن هذه الاعتمادية تخفي خطرًا حقيقيًا.",
        "يمكن لخوارزمية أو قرار إشرافي أو تعليق حساب أن يُفقدك بين عشية وضحاها وصولًا إلى جمهورك. إليك لماذا حان الوقت لتنويع حضورك على الإنترنت.",
      ],
      en: [
        "Many Algerian entrepreneurs have built their business almost entirely on Facebook. That's understandable: the platform is free, massive, and immediate. Yet this dependency hides a real risk.",
        "An algorithm change, a moderation decision, or an account suspension can wipe out your audience access overnight. Here's why it's time to diversify your online presence.",
      ],
    },
    sections: [
      {
        heading: {
          fr: "Vous ne possédez pas votre audience",
          ar: "لا تملك جمهورك",
          en: "You don't own your audience",
        },
        paragraphs: {
          fr: [
            "Sur Facebook, vos abonnés ne sont pas vraiment à vous. L'entreprise américaine contrôle qui voit vos publications, quand et comment. Une baisse organique peut diviser votre portée par dix sans aucun avertissement.",
            "En comparaison, une liste d'emails ou un site web vous donne un canal direct. Personne ne peut unilatéralement couper ce lien avec vos clients.",
          ],
          ar: [
            "على فيسبوك، لا يُعتبر متابعوك ملكًا لك حقًا. الشركة الأمريكية تتحكم في من يرى منشوراتك ومتى وكيف. يمكن لانخفاض عضوي أن يُقسّم مدى وصولك إلى عشرة دون سابق إنذار.",
            "بالمقارنة، تمنحك قائمة بريد إلكتروني أو موقع إلكتروني قناة مباشرة. لا يمكن لأحد أن يقطع هذا الرابط مع عملائك من جانب واحد.",
          ],
          en: [
            "On Facebook, your followers aren't really yours. The U.S. company controls who sees your posts, when, and how. An organic drop can cut your reach tenfold without warning.",
            "By contrast, an email list or a website gives you a direct channel. No one can unilaterally sever that link to your customers.",
          ],
        },
      },
      {
        heading: {
          fr: "La modération, un danger sournois",
          ar: "الإشراف، خطر خفي",
          en: "Moderation, a hidden danger",
        },
        paragraphs: {
          fr: [
            "Des comptes professionnels sont suspendus chaque jour pour des motifs parfois opaques. Le processus de récupération est long, stressant et sans garantie. Pendant ce temps, votre business est paralysé.",
            "Avoir un site web propre vous permet de rester visible, de continuer à vendre et de communiquer même si vos réseaux sociaux rencontrent un problème.",
          ],
          ar: [
            "تُعلق حسابات مهنية كل يوم لأسباب غير شفافة أحيانًا. عملية الاسترداد طويلة ومرهقة وغير مضمونة. وخلال ذلك، يتعطل عملك.",
            "امتلاك موقع إلكتروني خاص يتيح لك البقاء مرئيًا والاستمرار في البيع والتواصل حتى إذا واجهت شبكاتك الاجتماعية مشكلة.",
          ],
          en: [
            "Business accounts are suspended daily for sometimes opaque reasons. The recovery process is long, stressful, and uncertain. Meanwhile, your business is paralyzed.",
            "Having your own website lets you stay visible, keep selling, and keep communicating even if your social media hits a snag.",
          ],
        },
      },
      {
        heading: {
          fr: "Construisez des actifs durables",
          ar: "ابنِ أصولًا مستدامة",
          en: "Build lasting assets",
        },
        paragraphs: {
          fr: [
            "Un nom de domaine, un site web, une base de contacts : ce sont des actifs. Ils prennent de la valeur avec le temps et ne dépendent pas d'une seule plateforme.",
            "Commencez par rediriger une partie de votre trafic Facebook vers une page de capture ou votre site. Petit à petit, vous récupérez le contrôle.",
          ],
          ar: [
            "اسم النطاق والموقع الإلكتروني وقاعدة جهات الاتصال: هذه أصول. تكتسب قيمة مع مرور الوقت ولا تعتمد على منصة واحدة.",
            "ابدأ بتوجيه جزء من حركة فيسبوك نحو صفحة تسجيل أو موقعك. تدريجيًا، تستعيد السيطرة.",
          ],
          en: [
            "A domain name, a website, a contact base: these are assets. They gain value over time and don't depend on a single platform.",
            "Start by redirecting some of your Facebook traffic to a capture page or your site. Little by little, you regain control.",
          ],
        },
      },
    ],
    videoHeading: {
      fr: "Vidéo complémentaire",
      ar: "فيديو تكميلي",
      en: "Related video",
    },
  },
  "independance-digitale": {
    intro: {
      fr: [
        "L'indépendance digitale, c'est la capacité à vendre et communiquer en ligne sans être otage d'une seule plateforme. C'est un choix stratégique, pas seulement technique.",
        "Pour les entrepreneurs algériens, elle devient indispensable dans un environnement où les règles du jeu changent constamment.",
      ],
      ar: [
        "الاستقلالية الرقمية هي القدرة على البيع والتواصل عبر الإنترنت دون أن تكون رهينة منصة واحدة. إنها خيار استراتيجي وليس تقنيًا فحسب.",
        "بالنسبة لرياديي الأعمال الجزائريين، أصبحت ضرورية في بيئة تتغير فيها قواعد اللعاب باستمرار.",
      ],
      en: [
        "Digital independence is the ability to sell and communicate online without being hostage to a single platform. It's a strategic choice, not just a technical one.",
        "For Algerian entrepreneurs, it is becoming essential in an environment where the rules of the game constantly change.",
      ],
    },
    sections: [
      {
        heading: {
          fr: "Le site web, votre terrain propre",
          ar: "الموقع الإلكتروني، أرضك الخاصة",
          en: "The website, your own ground",
        },
        paragraphs: {
          fr: [
            "Votre site web est la seule propriété digitale que vous contrôlez vraiment. Vous décidez du design, des messages, des offres et de l'expérience utilisateur.",
            "C'est aussi le meilleur endroit pour raconter votre histoire, présenter vos services et convertir des visiteurs en clients.",
          ],
          ar: [
            "موقعك الإلكتروني هو الممتلكة الرقمية الوحيدة التي تتحكم فيها حقًا. أنت تقرر التصميم والرسائل والعروض وتجربة المستخدم.",
            "إنه أيضًا أفضل مكان لسرد قصتك وعرض خدماتك وتحويل الزوار إلى عملاء.",
          ],
          en: [
            "Your website is the only digital property you truly control. You decide the design, messaging, offers, and user experience.",
            "It's also the best place to tell your story, present your services, and convert visitors into customers.",
          ],
        },
      },
      {
        heading: {
          fr: "L'email, canal direct et personnel",
          ar: "البريد الإلكتروني، قناة مباشرة وشخصية",
          en: "Email, a direct and personal channel",
        },
        paragraphs: {
          fr: [
            "Les réseaux sociaux vous prêtent une audience. L'email, vous l'avez captée. Un abonné à votre newsletter a une valeur bien supérieure à un simple like.",
            "Utilisez des lead magnets pertinents : guide gratuit, check-list, offre de bienvenue. Votre liste devient alors un actif rentable.",
          ],
          ar: [
            "تُقرضك الشبكات الاجتماعية جمهورًا. أما البريد الإلكتروني فقد استحوذت عليه. مشترك في نشرتك الإخبارية له قيمة أعلى بكثير من إعجاب بسيط.",
            "استخدم مغناطيسات عملاء محتملين ذات صلة: دليل مجاني، قائمة مرجعية، عرض ترحيب. تصبح قائمتك حينها أصلًا مربحًا.",
          ],
          en: [
            "Social media lends you an audience. Email, you've captured it. A newsletter subscriber is far more valuable than a simple like.",
            "Use relevant lead magnets: free guide, checklist, welcome offer. Your list then becomes a profitable asset.",
          ],
        },
      },
      {
        heading: {
          fr: "Le contenu qui travaille pour vous",
          ar: "المحتوى الذي يعمل من أجلك",
          en: "Content that works for you",
        },
        paragraphs: {
          fr: [
            "Articles, tutoriels, témoignages : le contenu de qualité attire du trafic qualifié pendant des mois, voire des années. Il positionne votre marque comme référence.",
            "Concentrez-vous sur les vraies questions de vos clients. Un article bien ciblé vaut mieux que dix posts éphémères.",
          ],
          ar: [
            "المقالات والدروس التطبيقية وشهادات العملاء: المحتوى عالي الجودة يجذب حركة مرور مؤهلة لأشهر بل سنوات. يُرسّخ علامتك كمرجع.",
            "ركّز على الأسئلة الحقيقية لعملائك. مقال مستهدف جيدًا أفضل من عشر منشورات عابرة.",
          ],
          en: [
            "Articles, tutorials, testimonials: quality content attracts qualified traffic for months or even years. It positions your brand as a reference.",
            "Focus on your customers' real questions. One well-targeted article is better than ten ephemeral posts.",
          ],
        },
      },
    ],
    videoHeading: {
      fr: "Vidéo complémentaire",
      ar: "فيديو تكميلي",
      en: "Related video",
    },
  },
  "premier-site-web": {
    intro: {
      fr: [
        "Créer son premier site web peut sembler intimidant. Entre le nom de domaine, l'hébergement, le design et le contenu, il est facile de se sentir perdu.",
        "Ce guide vous propose un parcours clair pour lancer un site professionnel adapté au marché algérien, sans budget démesuré.",
      ],
      ar: [
        "قد يبدو إنشاء موقعك الإلكتروني الأول مخيفًا. بين اسم النطاق والاستضافة والتصميم والمحتوى، من السهل أن تشعر بالضياع.",
        "يقدّم لك هذا الدليل مسارًا واضحًا لإطلاق موقع احترافي يناسب السوق الجزائرية دون ميزانية مبالغ فيها.",
      ],
      en: [
        "Creating your first website can feel intimidating. Between domain names, hosting, design, and content, it's easy to feel lost.",
        "This guide offers a clear path to launch a professional site suited to the Algerian market without an excessive budget.",
      ],
    },
    sections: [
      {
        heading: {
          fr: "Définir l'objectif de votre site",
          ar: "تحديد هدف موقعك",
          en: "Define your site's purpose",
        },
        paragraphs: {
          fr: [
            "Avant de choisir une technologie, clarifiez ce que doit accomplir votre site : présenter votre activité, vendre en ligne, capturer des leads ou démontrer votre expertise ?",
            "Cette décision oriente toutes les suivantes : structure, pages indispensables et appels à l'action.",
          ],
          ar: [
            "قبل اختيار التقنية، أوضح ما يجب أن يحققه موقعك: عرض نشاطك، أو البيع عبر الإنترنت، أو جذب العملاء المحتملين، أو إبراز خبرتك؟",
            "تحدّد هذه القرارة كل ما يلي: الهيكل والصفحات الضرورية ودعوات العمل.",
          ],
          en: [
            "Before choosing technology, clarify what your site must accomplish: present your business, sell online, capture leads, or demonstrate expertise?",
            "This decision drives all the others: structure, essential pages, and calls to action.",
          ],
        },
      },
      {
        heading: {
          fr: "Nom de domaine et hébergement",
          ar: "اسم النطاق والاستضافة",
          en: "Domain name and hosting",
        },
        paragraphs: {
          fr: [
            "Choisissez un nom de domaine simple, mémorable et aligné avec votre marque. Pour le marché algérien, privilégiez une extension .dz ou .com selon votre cible.",
            "Concernant l'hébergement, un hébergeur fiable avec support local ou francophone facilite grandement la gestion quotidienne.",
          ],
          ar: [
            "اختر اسم نطاق بسيط وسهل التذكر ومتوافق مع علامتك. بالنسبة للسوق الجزائرية، فضّل امتداد .dz أو .com حسب جمهورك المستهدف.",
            "أما الاستضافة، فإن مضيفًا موثوقًا بدعم محلي أو ناطق بالفرنسية يسهّل الإدارة اليومية كثيرًا.",
          ],
          en: [
            "Choose a simple, memorable domain name aligned with your brand. For the Algerian market, prefer a .dz or .com extension depending on your target.",
            "For hosting, a reliable provider with local or French-speaking support greatly eases daily management.",
          ],
        },
      },
      {
        heading: {
          fr: "Design et contenu qui convertissent",
          ar: "تصميم ومحتوى يحوّلان الزوار",
          en: "Design and content that convert",
        },
        paragraphs: {
          fr: [
            "Un bon design n'est pas seulement esthétique. Il guide l'œil, rassure et incite à l'action. Privilégiez la simplicité, la rapidité de chargement et l'affichage mobile.",
            "Quant au contenu, soyez clair sur ce que vous proposez, pour qui et pourquoi. Un visiteur doit comprendre en quelques secondes s'il est au bon endroit.",
          ],
          ar: [
            "التصميم الجيد ليس جماليًا فقط. يوجه العين ويطمئن ويحفّز على العمل. فضّل البساطة وسرعة التحميل والعرض على الجوال.",
            "أما المحتوى، فكن واضحًا بشأن ما تقدمه ولمن ولماذا. يجب أن يفهم الزائر في ثوانٍ ما إذا كان في المكان الصحيح.",
          ],
          en: [
            "Good design isn't just aesthetic. It guides the eye, reassures, and prompts action. Prioritize simplicity, loading speed, and mobile display.",
            "As for content, be clear about what you offer, for whom, and why. A visitor should understand within seconds if they're in the right place.",
          ],
        },
      },
    ],
    videoHeading: {
      fr: "Vidéo complémentaire",
      ar: "فيديو تكميلي",
      en: "Related video",
    },
  },
  "e-commerce-algerie": {
    intro: {
      fr: [
        "Le e-commerce en Algérie évolue rapidement. Les consommateurs sont de plus en plus connectés, mais la confiance reste le premier frein à l'achat en ligne.",
        "Voici les fondamentaux pour lancer une boutique en ligne qui rassure et convertit.",
      ],
      ar: [
        "تتطور التجارة الإلكترونية في الجزائر بسرعة. المستهلكون متصلون بشكل متزايد، لكن الثقة تظل العائق الأول أمام الشراء عبر الإنترنت.",
        "إليك الأساسيات لإطلاق متجر إلكتروني يطمئن ويحوّل.",
      ],
      en: [
        "E-commerce in Algeria is evolving rapidly. Consumers are increasingly connected, but trust remains the main barrier to online purchases.",
        "Here are the fundamentals for launching an online store that reassures and converts.",
      ],
    },
    sections: [
      {
        heading: {
          fr: "Comprendre le marché algérien",
          ar: "فهم السوق الجزائرية",
          en: "Understand the Algerian market",
        },
        paragraphs: {
          fr: [
            "Le paiement à la livraison reste dominant. Proposer cette option est souvent indispensable pour rassurer les nouveaux clients. Les portefeuilles électroniques gagnent du terrain, mais lentement.",
            "Adaptez vos offres aux habitudes locales : livraison rapide, prix affichés en dinar algérien et service client réactif.",
          ],
          ar: [
            "يظل الدفع عند الاستلام مهيمنًا. غالبًا ما يكون تقديم هذا الخيار ضروريًا لطمأنة العملاء الجدد. محافظ الدفع الإلكتروني تكتسب شعبية، لكن ببطء.",
            "كيّف عروضك للعادات المحلية: توصيل سريع، أسعار بالدينار الجزائري، وخدمة عملاء سريعة.",
          ],
          en: [
            "Cash on delivery remains dominant. Offering this option is often essential to reassure new customers. E-wallets are gaining ground, but slowly.",
            "Adapt your offers to local habits: fast delivery, prices in Algerian dinars, and responsive customer service.",
          ],
        },
      },
      {
        heading: {
          fr: "Logistique et gestion des commandes",
          ar: "اللوجستيك وإدارة الطلبيات",
          en: "Logistics and order management",
        },
        paragraphs: {
          fr: [
            "Une livraison fiable est un avantage compétitif majeur. Choisissez des partenaires logistiques capables de couvrir les grandes villes et de tenir leurs délais.",
            "Automatisez le suivi des commandes et communiquez proactivement avec le client. Un acheteur informé est un acheteur plus confiant.",
          ],
          ar: [
            "التسليم الموثوق ميزة تنافسية كبرى. اختر شركاء لوجستيين قادرين على تغطية المدن الكبرى والالتزام بمواعيدهم.",
            "أتمت تتبع الطلبيات وتواصل بشكل استباقي مع العميل. المشتري المُعلَم هو مشتري أكثر ثقة.",
          ],
          en: [
            "Reliable delivery is a major competitive advantage. Choose logistics partners able to cover major cities and meet deadlines.",
            "Automate order tracking and communicate proactively with the customer. An informed buyer is a more confident buyer.",
          ],
        },
      },
      {
        heading: {
          fr: "Gagner la confiance des clients",
          ar: "كسب ثقة العملاء",
          en: "Earn customer trust",
        },
        paragraphs: {
          fr: [
            "Affichez des avis vérifiés, des photos réelles, des politiques de retour claires et un numéro de téléphone joignable. La transparence rassure.",
            "Investissez aussi dans le contenu : fiches produit détaillées, vidéos de démonstration et réponses aux questions fréquentes réduisent les hésitations.",
          ],
          ar: [
            "اعرض آراء مُتحقّقة وصورًا حقيقية وسياسات إرجاع واضحة ورقم هاتف يمكن التواصل معه. الشفافية تُطمئن.",
            "استثمر أيضًا في المحتوى: بطاقات منتج مفصّلة وفيديوهات توضيحية وأجوبة على الأسئلة الشائعة تقلل التردد.",
          ],
          en: [
            "Display verified reviews, real photos, clear return policies, and a reachable phone number. Transparency reassures.",
            "Invest in content too: detailed product sheets, demo videos, and answers to frequently asked questions reduce hesitation.",
          ],
        },
      },
    ],
    videoHeading: {
      fr: "Vidéo complémentaire",
      ar: "فيديو تكميلي",
      en: "Related video",
    },
  },
};

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return routing.locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return {};
  }
  const typedLocale = locale as Locale;
  return {
    title: post.title[typedLocale] ?? post.title.en,
    description: post.excerpt[typedLocale] ?? post.excerpt.en,
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);

  const post = await getBlogPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const article = ARTICLES[slug];
  if (!article) {
    notFound();
  }

  const t = await getTranslations("blog");
  const title = post.title[typedLocale] ?? post.title.en;
  const category = post.category[typedLocale] ?? post.category.en;

  const formattedDate = new Date(post.date).toLocaleDateString(
    typedLocale === "ar" ? "ar-DZ" : typedLocale === "en" ? "en-GB" : "fr-FR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <>
      <SchemaOrg
        data={[
          buildBlogPostingSchema({
            title,
            excerpt: post.excerpt[typedLocale] ?? post.excerpt.en,
            slug,
            image: post.image,
            date: post.date,
            author: post.author || "Business Algerie",
            locale: typedLocale,
            category,
          }),
          buildBreadcrumbSchema([
            { name: "Blog", item: buildPublicUrl(typedLocale, "/blog") },
            {
              name: title,
              item: buildPublicUrl(typedLocale, `/blog/${slug}`),
            },
          ]),
        ]}
      />
      <article className="bg-brand-soft py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-6 inline-flex ps-0"
            )}
          >
            <ArrowLeft className="me-2 size-4" />
            {t("back_to_blog")}
          </Link>

          <header className="mb-10">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary">{category}</Badge>
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3.5" />
                {formattedDate}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {post.readingTime} {t("reading_time_suffix")}
              </span>
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              {title}
            </h1>
          </header>

          {post.image && (
            <div className="relative mb-10 aspect-[2/1] w-full overflow-hidden rounded-xl">
              <Image
                src={post.image}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          <div className="prose prose-slate max-w-none">
            {article.intro[typedLocale]?.map((paragraph, index) => (
              <p
                key={`intro-${index}`}
                className="mb-4 text-lg leading-relaxed text-brand-text"
              >
                {paragraph}
              </p>
            ))}

            {article.sections.map((section, sectionIndex) => (
              <section key={sectionIndex} className="mb-10">
                <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground">
                  {section.heading[typedLocale] ?? section.heading.en}
                </h2>
                {section.paragraphs[typedLocale]?.map((paragraph, pIndex) => (
                  <p
                    key={`${sectionIndex}-${pIndex}`}
                    className="mb-4 leading-relaxed text-brand-text"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            {post.videoId && article.videoHeading && (
              <section className="mb-10">
                <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground">
                  {article.videoHeading[typedLocale] ?? article.videoHeading.en}
                </h2>
                <YouTubeEmbed videoId={post.videoId} title={title} />
              </section>
            )}
          </div>

          <div className="mt-12 space-y-6 border-t pt-8">
            <ShareButtons title={title} />
            <Link
              href="/blog"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full sm:w-auto"
              )}
            >
              <ArrowLeft className="me-2 size-4" />
              {t("back_to_blog")}
            </Link>
          </div>
        </div>
      </div>
    </article>
    </>
  );
}
