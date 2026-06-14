import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { CheckCircle, ArrowLeft, MessageCircle, Mail } from "lucide-react";

export default async function MerciPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);

  const t = await getTranslations();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto inline-flex rounded-full bg-green-100 p-4 text-green-600 dark:bg-green-900/30">
            <CheckCircle className="size-10" />
          </div>

          <h1 className="mt-6 font-heading text-3xl font-bold text-foreground md:text-4xl">
            {t("merci.title")}
          </h1>
          <p className="mt-4 text-lg text-brand-text">{t("merci.subtitle")}</p>

          <div className="mt-10 rounded-xl border bg-card p-6 text-left shadow-sm">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {t("merci.payment_title")}
            </h2>
            <p className="mt-2 text-brand-text">{t("merci.payment_instructions")}</p>

            <div className="mt-6 rounded-lg bg-brand-soft p-4">
              <p className="text-sm text-brand-text">{t("merci.ccp_label")}</p>
              <p className="font-mono text-lg font-semibold text-foreground">
                {t("merci.ccp_account")}
              </p>
              <p className="mt-2 text-sm text-brand-text">{t("merci.ccp_name")}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href="https://wa.me/213XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "w-full"
              )}
            >
              <MessageCircle className="me-2 size-4" />
              {t("merci.whatsapp")}
            </a>
            <a
              href="mailto:contact@businessalgerie.com"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "w-full"
              )}
            >
              <Mail className="me-2 size-4" />
              {t("merci.email")}
            </a>
          </div>

          <div className="mt-10">
            <Link
              href="/formations"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "inline-flex"
              )}
            >
              <ArrowLeft className="me-2 size-4" />
              {t("common.back")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
