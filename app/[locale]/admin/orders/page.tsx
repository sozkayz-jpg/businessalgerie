import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminOrders } from "@/components/admin-orders";
import { type Locale } from "@/i18n/routing";

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);

  const user = await requireSession();
  if (user.role !== "admin") redirect(`/${typedLocale}/member`);

  const t = await getTranslations("admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">{t("orders.title")}</h1>
        <p className="text-brand-text">{t("orders.subtitle")}</p>
      </div>
      <AdminOrders locale={typedLocale} />
    </div>
  );
}
