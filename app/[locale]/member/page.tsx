import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireSession } from "@/lib/auth";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { getAllCourses } from "@/lib/courses";
import { type Locale } from "@/i18n/routing";
import { formatPriceDZD } from "@/lib/courses";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/logout-button";
import { PlayCircle } from "lucide-react";

export default async function MemberDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);

  const user = await requireSession();
  const t = await getTranslations("member");
  const courses = await getAllCourses();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              {t("dashboard.title")}
            </h1>
            <p className="mt-1 text-brand-text">
              {t("dashboard.welcome", { name: user.name })}
            </p>
          </div>
          <LogoutButton locale={typedLocale} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const title = course.title[typedLocale] ?? course.title.en;
            return (
              <div
                key={course.slug}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  {title}
                </h2>
                <p className="mt-1 text-sm text-brand-text">
                  {formatPriceDZD(course.priceDZD, typedLocale)} {t("currency")}
                </p>
                <Link
                  href={`/member/formations/${course.slug}`}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "mt-4 inline-flex bg-brand-primary text-white hover:bg-brand-primary/90"
                  )}
                >
                  <PlayCircle className="me-2 size-4" />
                  {t("dashboard.watch")}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
