import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllCoursesAdmin } from "@/lib/cms/courses";
import { CoursesList } from "@/components/admin/courses-list";
import { type Locale } from "@/i18n/routing";

export default async function AdminCoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);
  const t = await getTranslations("admin");
  const courses = await getAllCoursesAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">{t("courses.title")}</h1>
        <p className="text-brand-text">{t("courses.subtitle")}</p>
      </div>
      <CoursesList courses={courses} locale={typedLocale} />
    </div>
  );
}
