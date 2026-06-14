import { notFound } from "next/navigation";
import { getTranslations, getMessages, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAllCourses, getCourseBySlug, formatPriceDZD } from "@/lib/courses";
import { type Locale } from "@/i18n/routing";
import { ArrowLeft, Check, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type ProgramItem = {
  title: string;
  items: string[];
};

type CourseDetail = {
  description?: string;
  learn?: string[];
  program?: ProgramItem[];
};

export function generateStaticParams() {
  return getAllCourses().map((course) => ({ slug: course.slug }));
}

export default async function FormationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);

  const course = getCourseBySlug(slug);
  if (!course) {
    notFound();
  }

  const t = await getTranslations();
  const messages = await getMessages();
  const detail: CourseDetail | undefined = (messages as { courseDetails?: Record<string, CourseDetail> }).courseDetails?.[slug];

  const title = course.title[typedLocale] ?? course.title.en;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/formations"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-6 inline-flex"
          )}
        >
          <ArrowLeft className="me-2 size-4" />
          {t("common.back")}
        </Link>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              {title}
            </h1>
            {detail?.description && (
              <p className="mt-4 text-lg text-brand-text">{detail.description}</p>
            )}

            <div className="mt-10">
              <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
                {t("pages.formation_detail.whatYouLearn")}
              </h2>
              <ul className="space-y-3">
                {detail?.learn?.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
                      <Check className="size-3" />
                    </span>
                    <span className="text-brand-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">
                {t("pages.formation_detail.program")}
              </h2>
              <Accordion className="w-full">
                {detail?.program?.map((module, i) => (
                  <AccordionItem key={i} value={`module-${i}`}>
                    <AccordionTrigger>{module.title}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc space-y-1 ps-5 text-brand-text">
                        {module.items.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border bg-brand-soft p-6">
              <p className="text-sm text-brand-text">{t("courses.currency")}</p>
              <p className="font-heading text-4xl font-bold text-foreground">
                {formatPriceDZD(course.priceDZD, typedLocale)}
              </p>
              <Link
                href={`/checkout/${course.slug}`}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-6 w-full bg-brand-accent text-white hover:bg-brand-accent/90"
                )}
              >
                {t("pages.formation_detail.register")}
                <Send className="ms-2 size-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
