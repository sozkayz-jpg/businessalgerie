import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { Globe, Shield, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [Globe, Shield, Rocket];

export async function SolutionSection() {
  const t = await getTranslations("home.solution");
  const items = t.raw("items") as Array<{ title: string; description: string }>;

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-accent">
            {t("eyebrow")}
          </p>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-brand-text">
            {t("subtitle")}
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = icons[index] ?? Globe;
            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="inline-flex rounded-lg bg-brand-primary/10 p-3 text-brand-primary">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-brand-text">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/formations"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-brand-accent text-white hover:bg-brand-accent/90"
            )}
          >
            {t("cta_primary")}
          </Link>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            )}
          >
            {t("cta_secondary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
