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
import { formatPriceDZD, type Course } from "@/lib/courses";
import { type Locale } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CourseCard({
  course,
  locale,
}: {
  course: Course;
  locale: Locale;
}) {
  const t = useTranslations("courses");
  const title = course.title[locale] ?? course.title.en;

  return (
    <Card className="relative flex flex-col">
      {course.isFlagship && (
        <Badge className="absolute top-4 right-4 bg-brand-accent text-white hover:bg-brand-accent">
          {t("flagship_label")}
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>
          {formatPriceDZD(course.priceDZD, locale)} {t("currency")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1" />
      <CardFooter>
        <Link
          href={`/formations/${course.slug}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full"
          )}
        >
          {t("cta_details")}
          <ArrowRight className="ms-2 size-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
