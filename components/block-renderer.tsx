import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { NewsletterForm } from "@/components/newsletter-form";
import { ContactForm } from "@/components/contact-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseCard } from "@/components/course-card";
import { BlogCard } from "@/components/blog-card";
import { getAllCourses } from "@/lib/courses";
import { getAllBlogPosts } from "@/lib/blog";
import { formatPriceDZD } from "@/lib/courses";
import { cn } from "@/lib/utils";
import type { Block, Page, BlogPost, Course } from "@/lib/cms/types";
import type { Locale } from "@/i18n/routing";
import {
  ArrowRight,
  PlayCircle,
  AlertTriangle,
  Lock,
  TrendingDown,
  Globe,
  Shield,
  Rocket,
  Quote,
  Check,
  Send,
  Target,
  BookOpen,
  Users,
} from "lucide-react";

const problemIcons = [AlertTriangle, Lock, TrendingDown];
const solutionIcons = [Globe, Shield, Rocket];
const aboutIcons = [Target, BookOpen, Users];

function classForLevel(level: number) {
  switch (level) {
    case 1:
      return "font-heading text-4xl font-bold text-foreground md:text-5xl";
    case 3:
      return "font-heading text-xl font-semibold text-foreground";
    default:
      return "font-heading text-3xl font-bold text-foreground md:text-4xl";
  }
}

function RichTextContent({ content }: { content: any }) {
  if (!content || !content.content) return null;
  return (
    <div className="prose prose-slate max-w-none">
      {content.content.map((node: any, i: number) => {
        if (node.type === "paragraph") {
          return (
            <p key={i} className="mb-4 leading-relaxed text-brand-text">
              {renderTipTapContent(node.content)}
            </p>
          );
        }
        if (node.type === "heading") {
          const Heading = `h${node.attrs?.level || 2}` as React.ElementType;
          return (
            <Heading key={i} className={classForLevel(node.attrs?.level || 2)}>
              {renderTipTapContent(node.content)}
            </Heading>
          );
        }
        if (node.type === "bulletList") {
          return (
            <ul key={i} className="mb-4 list-disc space-y-1 ps-5 text-brand-text">
              {node.content?.map((item: any, idx: number) => (
                <li key={idx}>{renderTipTapContent(item.content)}</li>
              ))}
            </ul>
          );
        }
        if (node.type === "orderedList") {
          return (
            <ol key={i} className="mb-4 list-decimal space-y-1 ps-5 text-brand-text">
              {node.content?.map((item: any, idx: number) => (
                <li key={idx}>{renderTipTapContent(item.content)}</li>
              ))}
            </ol>
          );
        }
        return null;
      })}
    </div>
  );
}

function renderTipTapContent(content?: any[]): React.ReactNode {
  if (!content) return null;
  return content.map((node, i) => {
    if (node.type === "text") {
      let el: React.ReactNode = node.text;
      if (node.marks) {
        for (const mark of node.marks) {
          if (mark.type === "bold") el = <strong key={i}>{el}</strong>;
          if (mark.type === "italic") el = <em key={i}>{el}</em>;
          if (mark.type === "link") {
            el = (
              <a key={i} href={mark.attrs?.href} className="text-brand-primary underline" target="_blank" rel="noopener">
                {el}
              </a>
            );
          }
        }
      }
      return <span key={i}>{el}</span>;
    }
    if (node.type === "hardBreak") return <br key={i} />;
    return null;
  });
}

async function HeroBlock({ props, locale }: { props: any; locale: Locale }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary to-brand-primary/90 py-24 text-white md:py-32">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-start">
            <p className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 ring-1 ring-white/20">
              {props.eyebrow}
            </p>
            <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {props.title}
            </h1>
            <p className="mt-6 text-lg text-white/90 md:text-xl">{props.subtitle}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href={props.ctaPrimaryHref || "/formations"}
                className={cn(buttonVariants({ size: "lg" }), "bg-brand-accent text-white hover:bg-brand-accent/90")}
              >
                {props.ctaPrimary}
                <ArrowRight className="ms-2 size-4" />
              </Link>
              <Link
                href={props.ctaSecondaryHref || "/contact"}
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
                )}
              >
                {props.ctaSecondary}
              </Link>
            </div>
            {props.videoHint && (
              <p className="mt-6 flex items-center justify-center gap-2 text-sm text-white/80 lg:justify-start">
                <PlayCircle className="size-4" />
                {props.videoHint}
              </p>
            )}
          </div>
          {props.image && (
            <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl lg:max-w-none">
              <Image src={props.image} alt={props.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
            </div>
          )}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.15),transparent_40%)]" />
    </section>
  );
}

function ProblemBlock({ props }: { props: any }) {
  return (
    <section className="bg-brand-soft py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-accent">{props.eyebrow}</p>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">{props.title}</h2>
          <p className="mt-4 text-lg text-brand-text">{props.subtitle}</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {props.items?.map((item: any, index: number) => {
            const Icon = problemIcons[index] || AlertTriangle;
            return (
              <div key={index} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="inline-flex rounded-lg bg-brand-accent/10 p-3 text-brand-accent">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-brand-text">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SolutionBlock({ props }: { props: any }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-accent">{props.eyebrow}</p>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">{props.title}</h2>
          <p className="mt-4 text-lg text-brand-text">{props.subtitle}</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {props.items?.map((item: any, index: number) => {
            const Icon = solutionIcons[index] || Globe;
            return (
              <div key={index} className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="inline-flex rounded-lg bg-brand-primary/10 p-3 text-brand-primary">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-brand-text">{item.description}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={props.ctaPrimaryHref || "/formations"}
            className={cn(buttonVariants({ size: "lg" }), "bg-brand-accent text-white hover:bg-brand-accent/90")}
          >
            {props.ctaPrimary || "Voir les formations"}
          </Link>
          <Link
            href={props.ctaSecondaryHref || "/contact"}
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            )}
          >
            {props.ctaSecondary || "Demander un accompagnement"}
          </Link>
        </div>
      </div>
    </section>
  );
}

async function CoursesPreviewBlock({ props, locale }: { props: any; locale: Locale }) {
  const courses = (await getAllCourses()).slice(0, props.limit || 3);
  return (
    <section className="bg-brand-soft py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-accent">{props.eyebrow}</p>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">{props.title}</h2>
          <p className="mt-4 text-lg text-brand-text">{props.subtitle}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} locale={locale} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/formations"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            )}
          >
            {props.ctaAll || "Voir toutes les formations"}
            <ArrowRight className="ms-2 size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TestimonialsBlock({ props }: { props: any }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-accent">{props.eyebrow}</p>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">{props.title}</h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {props.items?.map((item: any, index: number) => {
            const initial = item.author?.charAt(0).toUpperCase() || "?";
            return (
              <div key={index} className="relative rounded-xl border border-border bg-card p-6 shadow-sm">
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

function FAQBlock({ props }: { props: any }) {
  return (
    <section className="bg-brand-soft py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-accent">{props.eyebrow}</p>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">{props.title}</h2>
        </div>
        <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-border bg-card p-2 shadow-sm">
          <Accordion defaultValue={["faq-0"]}>
            {props.items?.map((item: any, index: number) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="px-4 text-base font-medium text-foreground">{item.question}</AccordionTrigger>
                <AccordionContent className="px-4 text-brand-text">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

function CTABlock({ props }: { props: any }) {
  return (
    <section className="relative overflow-hidden bg-brand-primary py-20 text-white md:py-28">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">{props.title}</h2>
          <p className="mt-4 text-lg text-white/90">{props.subtitle}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={props.ctaPrimaryHref || "/formations"}
              className={cn(buttonVariants({ size: "lg" }), "bg-brand-accent text-white hover:bg-brand-accent/90")}
            >
              {props.ctaPrimary}
              <ArrowRight className="ms-2 size-4" />
            </Link>
            <Link
              href={props.ctaSecondaryHref || "/contact"}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
              )}
            >
              {props.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -top-20 -right-20 size-80 rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-brand-accent/10 blur-3xl" />
    </section>
  );
}

function ServicesGridBlock({ props }: { props: any }) {
  return (
    <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {props.services?.map((service: any, i: number) => (
        <div
          key={i}
          className="rounded-xl border bg-brand-soft p-6 transition-colors hover:border-brand-primary/20"
        >
          <h3 className="font-heading text-lg font-semibold text-foreground">{service.title}</h3>
          <p className="mt-2 text-sm text-brand-text">{service.desc}</p>
        </div>
      ))}
    </div>
  );
}

function ServicesCardsBlock({ props }: { props: any }) {
  return (
    <div className="mt-16 grid gap-6 md:grid-cols-2">
      {props.items?.map((service: any, i: number) => (
        <Card key={i} className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-heading text-xl">{service.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-brand-text">{service.desc}</p>
            <ul className="mt-4 space-y-2">
              {service.features?.map((feature: string, j: number) => (
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
  );
}

async function CoursesGridBlock({ locale }: { locale: Locale }) {
  const courses = await getAllCourses();
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.slug} course={course} locale={locale} />
      ))}
    </div>
  );
}

async function BlogGridBlock({ locale }: { locale: Locale }) {
  const posts = await getAllBlogPosts();
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} locale={locale} />
      ))}
    </div>
  );
}

function AboutCardsBlock({ props }: { props: any }) {
  const items = [
    { title: props.missionTitle, desc: props.missionDesc, Icon: Target },
    { title: props.storyTitle, desc: props.storyDesc, Icon: BookOpen },
    { title: props.teamTitle, desc: props.teamDesc, Icon: Users },
  ];
  return (
    <div className="mt-16 grid gap-6 md:grid-cols-3">
      {items.map((item, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center gap-4">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
              <item.Icon className="size-5" />
            </span>
            <CardTitle className="font-heading text-lg">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-brand-text">{item.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ButtonBlock({ props }: { props: any }) {
  return (
    <div className={cn("flex", props.align === "center" ? "justify-center" : props.align === "end" ? "justify-end" : "justify-start")}>
      <Link
        href={props.href || "#"}
        className={cn(
          buttonVariants({ size: props.size || "lg" }),
          props.variant === "primary"
            ? "bg-brand-accent text-white hover:bg-brand-accent/90"
            : "border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
        )}
      >
        {props.text}
        {props.showArrow && <ArrowRight className="ms-2 size-4" />}
      </Link>
    </div>
  );
}

export async function BlockRenderer({
  blocks,
  locale,
  page,
  post,
}: {
  blocks: Block[];
  locale: Locale;
  page?: Page;
  post?: BlogPost;
}) {
  const rendered = await Promise.all(
    blocks.map(async (block) => {
      switch (block.type) {
        case "hero":
          return <HeroBlock key={block.id} props={block.props} locale={locale} />;
        case "problem":
          return <ProblemBlock key={block.id} props={block.props} />;
        case "solution":
          return <SolutionBlock key={block.id} props={block.props} />;
        case "courses_preview":
          return <CoursesPreviewBlock key={block.id} props={block.props} locale={locale} />;
        case "testimonial":
          return <TestimonialsBlock key={block.id} props={block.props} />;
        case "faq":
          return <FAQBlock key={block.id} props={block.props} />;
        case "cta":
          return <CTABlock key={block.id} props={block.props} />;
        case "newsletter":
          return <NewsletterForm key={block.id} />;
        case "contact_form":
          return <section key={block.id} className="py-10"><ContactForm /></section>;
        case "services_grid":
          return <ServicesGridBlock key={block.id} props={block.props} />;
        case "services_cards":
          return <ServicesCardsBlock key={block.id} props={block.props} />;
        case "course_grid":
          return <CoursesGridBlock key={block.id} locale={locale} />;
        case "blog_grid":
          return <BlogGridBlock key={block.id} locale={locale} />;
        case "about_cards":
          return <AboutCardsBlock key={block.id} props={block.props} />;
        case "heading":
          const Heading = `h${block.props.level || 2}` as React.ElementType;
          return <Heading key={block.id} className={classForLevel(block.props.level || 2)}>{block.props.text}</Heading>;
        case "paragraph":
          return <p key={block.id} className="mb-4 leading-relaxed text-brand-text">{block.props.text}</p>;
        case "rich_text":
          return <div key={block.id} className="py-2"><RichTextContent content={block.props.content} /></div>;
        case "image":
          return (
            <div key={block.id} className="relative my-6 aspect-video w-full overflow-hidden rounded-xl">
              <Image src={block.props.src} alt={block.props.alt || ""} fill className="object-cover" sizes="100vw" />
            </div>
          );
        case "video":
          return (
            <div key={block.id} className="my-6 aspect-video overflow-hidden rounded-xl">
              <YouTubeEmbed videoId={block.props.videoId} title={block.props.title || ""} />
            </div>
          );
        case "button":
          return <ButtonBlock key={block.id} props={block.props} />;
        case "quote":
          return (
            <blockquote key={block.id} className="my-6 border-s-4 border-brand-accent bg-brand-soft p-6 italic text-brand-text">
              &ldquo;{block.props.text}&rdquo;
              {block.props.author && <cite className="mt-2 block text-sm not-italic">— {block.props.author}</cite>}
            </blockquote>
          );
        case "list":
          return block.props.ordered ? (
            <ol key={block.id} className="mb-4 list-decimal space-y-1 ps-5 text-brand-text">
              {block.props.items?.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          ) : (
            <ul key={block.id} className="mb-4 list-disc space-y-1 ps-5 text-brand-text">
              {block.props.items?.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        case "divider":
          return <hr key={block.id} className="my-8 border-border" />;
        default:
          return null;
      }
    })
  );

  return <>{rendered}</>;
}
