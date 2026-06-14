import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export async function CTASection() {
  const t = await getTranslations("home.cta");

  return (
    <section className="relative overflow-hidden bg-brand-primary py-20 text-white md:py-28">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Sparkles className="mx-auto size-10 text-brand-accent" />
          <h2 className="mt-6 font-heading text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-white/90">
            {t("subtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/formations"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-brand-accent text-white hover:bg-brand-accent/90"
              )}
            >
              {t("cta_primary")}
              <ArrowRight className="ms-2 size-4" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-white text-white hover:bg-white/10 hover:text-white"
              )}
            >
              {t("cta_secondary")}
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -top-20 -right-20 size-80 rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-brand-accent/10 blur-3xl" />
    </section>
  );
}
