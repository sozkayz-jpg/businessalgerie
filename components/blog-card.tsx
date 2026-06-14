import { useTranslations } from "next-intl";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { type BlogPost } from "@/lib/blog";
import { type Locale } from "@/i18n/routing";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function BlogCard({
  post,
  locale,
}: {
  post: BlogPost;
  locale: Locale;
}) {
  const t = useTranslations("blog");
  const title = post.title[locale] ?? post.title.en;
  const excerpt = post.excerpt[locale] ?? post.excerpt.en;
  const category = post.category[locale] ?? post.category.en;

  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === "ar" ? "ar-DZ" : locale === "en" ? "en-GB" : "fr-FR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <Card className="relative flex flex-col overflow-hidden">
      {post.image && (
        <div className="relative aspect-[2/1] w-full overflow-hidden">
          <Image
            src={post.image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">{category}</Badge>
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" />
            {formattedDate}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {post.readingTime} {t("reading_time_suffix")}
          </span>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="line-clamp-3">{excerpt}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1" />
      <CardFooter>
        <Link
          href={`/blog/${post.slug}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full"
          )}
        >
          {t("read_more")}
          <ArrowRight className="ms-2 size-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
