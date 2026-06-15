import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSiteSettings } from "@/lib/cms/settings";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { type Locale } from "@/i18n/routing";

export default async function AdminSitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);
  const t = await getTranslations("admin");
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">{t("site.title")}</h1>
        <p className="text-brand-text">{t("site.subtitle")}</p>
      </div>
      <SiteSettingsForm settings={settings} />
    </div>
  );
}
