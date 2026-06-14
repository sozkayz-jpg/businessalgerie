import { getTranslations } from "next-intl/server";
import { Quote } from "lucide-react";

export async function TestimonialsSection() {
  const t = await getTranslations("home.testimonials");
  const items = t.raw("items") as Array<{
    quote: string;
    author: string;
    role: string;
  }>;

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
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const initial = item.author.charAt(0).toUpperCase();
            return (
              <div
                key={index}
                className="relative rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <Quote className="absolute top-4 end-4 size-6 text-brand-accent/30" />
                <p className="relative z-10 text-foreground">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-primary font-semibold text-primary-foreground">
                    {initial}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.author}</p>
                    <p className="text-sm text-brand-text">{item.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
