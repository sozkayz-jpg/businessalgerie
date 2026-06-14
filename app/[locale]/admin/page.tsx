import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminOrders } from "@/components/admin-orders";
import { type Locale } from "@/i18n/routing";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);

  const user = await requireSession();
  if (user.role !== "admin") {
    redirect(`/${typedLocale}/member`);
  }

  const t = await getTranslations("admin");

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            {t("title")}
          </h1>
          <p className="mt-2 text-brand-text">{t("subtitle")}</p>
        </div>

        <AdminOrders locale={typedLocale} />
      </div>
    </section>
  );
}
