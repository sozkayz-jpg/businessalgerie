import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { type Locale } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

export default async function AgencyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);
  const t = await getTranslations("pages.agence");

  const services = t.raw("services") as Array<{ title: string; desc: string }>;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-brand-text">{t("intro")}</p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <div
              key={i}
              className="rounded-xl border bg-brand-soft p-6 transition-colors hover:border-brand-primary/20"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-brand-text">{service.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className={buttonVariants({
              size: "lg",
              className: "bg-brand-accent text-white hover:bg-brand-accent/90",
            })}
          >
            {t("cta")}
            <ArrowRight className="ms-2 size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
