import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCourseByIdAdmin } from "@/lib/cms/courses";
import { CourseEditor } from "@/components/admin/course-editor";
import { type Locale } from "@/i18n/routing";

export default async function AdminCourseEditorPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);
  const t = await getTranslations("admin");
  const course = await getCourseByIdAdmin(id);
  if (!course) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">{t("courses.edit")}</h1>
        <p className="text-brand-text">{course.slug}</p>
      </div>
      <CourseEditor course={course} />
    </div>
  );
}
