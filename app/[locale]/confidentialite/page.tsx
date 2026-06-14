import { getTranslations, setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";

export default async function ConfidentialitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);
  const t = await getTranslations("pages.confidentialite");

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-brand-text">
          {t("content")}
        </p>
      </div>
    </section>
  );
}
