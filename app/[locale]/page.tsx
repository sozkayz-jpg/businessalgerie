import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/hero-section";
import { ProblemSection } from "@/components/problem-section";
import { SolutionSection } from "@/components/solution-section";
import { CoursesPreviewSection } from "@/components/courses-preview-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FAQSection } from "@/components/faq-section";
import { CTASection } from "@/components/cta-section";
import { NewsletterForm } from "@/components/newsletter-form";
import { type Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);

  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <CoursesPreviewSection locale={typedLocale} />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterForm />
      <CTASection />
    </>
  );
}
