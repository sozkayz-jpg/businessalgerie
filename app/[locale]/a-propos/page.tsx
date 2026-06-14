import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Locale } from "@/i18n/routing";
import { ArrowRight, Target, BookOpen, Users } from "lucide-react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);
  const t = await getTranslations("pages.about");

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            {t("title")}
          </h1>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                <Target className="size-5" />
              </span>
              <CardTitle className="font-heading text-lg">{t("mission.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-text">{t("mission.desc")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                <BookOpen className="size-5" />
              </span>
              <CardTitle className="font-heading text-lg">{t("story.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-text">{t("story.desc")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                <Users className="size-5" />
              </span>
              <CardTitle className="font-heading text-lg">{t("team.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-brand-text">{t("team.desc")}</p>
            </CardContent>
          </Card>
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
