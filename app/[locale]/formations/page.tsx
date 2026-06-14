import { getTranslations, setRequestLocale } from "next-intl/server";
import { CourseCard } from "@/components/course-card";
import { getAllCourses } from "@/lib/courses";
import { type Locale } from "@/i18n/routing";

export default async function FormationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);

  const t = await getTranslations();
  const courses = getAllCourses();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            {t("pages.formations.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-text">
            {t("pages.formations.intro")}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.slug}
              course={course}
              locale={typedLocale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
