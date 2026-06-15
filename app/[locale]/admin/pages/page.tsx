import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllPages } from "@/lib/cms/pages";
import { PagesList } from "@/components/admin/pages-list";
import { type Locale } from "@/i18n/routing";

export default async function AdminPagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);
  const t = await getTranslations("admin");
  const pages = await getAllPages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">{t("pages.title")}</h1>
        <p className="text-brand-text">{t("pages.subtitle")}</p>
      </div>
      <PagesList pages={pages} locale={typedLocale} />
    </div>
  );
}
