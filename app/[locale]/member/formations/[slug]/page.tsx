import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireSession } from "@/lib/auth";
import { getCourseBySlug, getAllCourses } from "@/lib/courses";
import { type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return getAllCourses().map((course) => ({ slug: course.slug }));
}

export default async function MemberCoursePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);

  await requireSession();

  const course = getCourseBySlug(slug);
  if (!course) {
    notFound();
  }

  const t = await getTranslations("member");
  const title = course.title[typedLocale] ?? course.title.en;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/member"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-6 inline-flex"
            )}
          >
            <ArrowLeft className="me-2 size-4" />
            {t("course.back")}
          </Link>

          <h1 className="font-heading text-3xl font-bold text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-brand-text">{t("course.subtitle")}</p>

          <div className="mt-8 aspect-video overflow-hidden rounded-xl">
            <YouTubeEmbed videoId="dQw4w9WgXcQ" title={title} />
          </div>

          <div className="mt-8 rounded-xl border bg-card p-6">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {t("course.modules")}
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-3 text-brand-text">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-medium text-white">
                  1
                </span>
                {t("course.module_intro")}
              </li>
              <li className="flex items-center gap-3 text-brand-text">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-medium text-white">
                  2
                </span>
                {t("course.module_practice")}
              </li>
              <li className="flex items-center gap-3 text-brand-text">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-medium text-white">
                  3
                </span>
                {t("course.module_advanced")}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
