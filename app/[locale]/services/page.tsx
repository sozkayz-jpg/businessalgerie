import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Locale } from "@/i18n/routing";
import { ArrowRight, Check } from "lucide-react";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);
  const t = await getTranslations("pages.services");

  const items = t.raw("items") as Array<{
    title: string;
    desc: string;
    features: string[];
  }>;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-brand-text">{t("intro")}</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {items.map((service, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-heading text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-brand-text">{service.desc}</p>
                <ul className="mt-4 space-y-2">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-brand-text">
                      <Check className="size-4 shrink-0 text-brand-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
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
