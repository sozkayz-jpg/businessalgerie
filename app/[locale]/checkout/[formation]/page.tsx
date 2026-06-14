import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCourseBySlug, getAllCourses, formatPriceDZD } from "@/lib/courses";
import { type Locale } from "@/i18n/routing";
import { CheckoutForm } from "@/components/checkout-form";

export function generateStaticParams() {
  return getAllCourses().map((course) => ({ formation: course.slug }));
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string; formation: string }>;
}) {
  const { locale, formation } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);

  const course = getCourseBySlug(formation);
  if (!course) {
    notFound();
  }

  const t = await getTranslations();
  const title = course.title[typedLocale] ?? course.title.en;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            {t("checkout.title")}
          </h1>
          <p className="mt-2 text-brand-text">{t("checkout.subtitle")}</p>

          <div className="mt-8 rounded-xl border bg-brand-soft p-6">
            <p className="text-sm text-brand-text">{t("checkout.course")}</p>
            <p className="font-heading text-xl font-semibold text-foreground">
              {title}
            </p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-heading text-4xl font-bold text-foreground">
                {formatPriceDZD(course.priceDZD, typedLocale)}
              </span>
              <span className="text-brand-text">{t("courses.currency")}</span>
            </div>
          </div>

          <CheckoutForm
            courseSlug={course.slug}
            courseTitle={title}
            amount={course.priceDZD}
            locale={typedLocale}
          />
        </div>
      </div>
    </section>
  );
}
