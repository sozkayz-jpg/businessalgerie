import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card";
import { getAllCourses } from "@/lib/courses";
import { type Locale } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export async function CoursesPreviewSection({
  locale,
}: {
  locale: Locale;
}) {
  const t = await getTranslations("home.courses_preview");
  const courses = (await getAllCourses()).slice(0, 3);

  return (
    <section className="bg-brand-soft py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-accent">
            {t("eyebrow")}
          </p>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-brand-text">
            {t("subtitle")}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} locale={locale} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/formations"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            )}
          >
            {t("cta_all")}
            <ArrowRight className="ms-2 size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
