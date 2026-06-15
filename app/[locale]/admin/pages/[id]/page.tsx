import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllPages } from "@/lib/cms/pages";
import { PageEditor } from "@/components/admin/page-editor";
import { type Locale } from "@/i18n/routing";

export default async function AdminPageEditorPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);
  const t = await getTranslations("admin");
  const pages = await getAllPages();
  const page = pages.find((p) => p.id === id);
  if (!page) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">{t("pages.edit")}</h1>
        <p className="text-brand-text">{page.slug}</p>
      </div>
      <PageEditor page={page} locale={typedLocale} />
    </div>
  );
}
