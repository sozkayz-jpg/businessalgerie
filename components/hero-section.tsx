import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export async function HeroSection() {
  const t = await getTranslations("home.hero");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary to-brand-primary/90 py-24 text-white md:py-32">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-start">
            <p className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 ring-1 ring-white/20">
              {t("eyebrow")}
            </p>
            <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-6 text-lg text-white/90 md:text-xl">
              {t("subtitle")}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
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
                  "border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
                )}
              >
                {t("cta_secondary")}
              </Link>
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 text-sm text-white/80 lg:justify-start">
              <PlayCircle className="size-4" />
              {t("video_hint")}
            </p>
          </div>

          <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl lg:max-w-none">
            <Image
              src="/images/hero.webp"
              alt="Business Algerie digital illustration"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.15),transparent_40%)]" />
    </section>
  );
}
