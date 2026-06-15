import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllMedia } from "@/lib/cms/media";
import { MediaManager } from "@/components/admin/media-manager";
import { type Locale } from "@/i18n/routing";

export default async function AdminMediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);
  const t = await getTranslations("admin");
  const media = await getAllMedia();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">{t("media.title")}</h1>
        <p className="text-brand-text">{t("media.subtitle")}</p>
      </div>
      <MediaManager initialMedia={media} />
    </div>
  );
}
