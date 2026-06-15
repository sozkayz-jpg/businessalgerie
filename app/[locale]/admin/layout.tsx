import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { type Locale } from "@/i18n/routing";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);

  const user = await requireSession();
  if (user.role !== "admin") {
    redirect(`/${typedLocale}/member`);
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-brand-soft">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <AdminSidebar locale={typedLocale} />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
