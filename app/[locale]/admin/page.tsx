import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrders } from "@/lib/orders";
import { getPageViewsSummary, getEventsSummary } from "@/lib/cms/analytics";
import { type Locale } from "@/i18n/routing";
import { Eye, MousePointerClick, ShoppingCart, Users } from "lucide-react";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);
  const t = await getTranslations("admin");

  const [orders, pageViews, events] = await Promise.all([
    getOrders(),
    getPageViewsSummary(30),
    getEventsSummary(30),
  ]);

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const recentViews = pageViews.filter((v) => new Date(v.created_at) >= thirtyDaysAgo);
  const recentEvents = events.filter((e) => new Date(e.created_at) >= thirtyDaysAgo);

  const stats = [
    { label: "Commandes", value: orders.length, icon: ShoppingCart },
    { label: "Pages vues (30j)", value: recentViews.length, icon: Eye },
    { label: "Événements (30j)", value: recentEvents.length, icon: MousePointerClick },
    { label: "Sessions uniques", value: new Set(recentViews.map((v) => v.session_id)).size, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-brand-text">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-brand-text">{stat.label}</CardTitle>
              <stat.icon className="size-4 text-brand-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
