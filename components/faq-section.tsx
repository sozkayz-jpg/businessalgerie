import { getTranslations } from "next-intl/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export async function FAQSection() {
  const t = await getTranslations("home.faq");
  const items = t.raw("items") as Array<{ question: string; answer: string }>;

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
        </div>
        <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-border bg-card p-2 shadow-sm">
          <Accordion defaultValue={["faq-0"]}>
            {items.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="px-4 text-base font-medium text-foreground">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 text-brand-text">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
