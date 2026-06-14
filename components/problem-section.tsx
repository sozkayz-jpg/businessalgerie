import { getTranslations } from "next-intl/server";
import { AlertTriangle, Lock, TrendingDown } from "lucide-react";

const icons = [AlertTriangle, Lock, TrendingDown];

export async function ProblemSection() {
  const t = await getTranslations("home.problem");
  const items = t.raw("items") as Array<{ title: string; description: string }>;

  return (
    <section className="bg-brand-soft py-20 md:py-28">
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
            const Icon = icons[index] ?? AlertTriangle;
            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="inline-flex rounded-lg bg-brand-accent/10 p-3 text-brand-accent">
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
      </div>
    </section>
  );
}
