import { getTranslations, setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/login-form";
import { type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MemberLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);

  const session = await getSession();
  if (session) {
    redirect(`/${typedLocale}/member`);
  }

  const t = await getTranslations("member.login");

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground">
              {t("title")}
            </h1>
            <p className="mt-2 text-brand-text">{t("subtitle")}</p>
          </div>

          <LoginForm locale={typedLocale} />

          <p className="mt-6 text-center text-sm text-brand-text">
            {t("no_account")}{" "}
            <Link
              href="/formations"
              className="font-medium text-brand-primary hover:underline"
            >
              {t("browse_courses")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
