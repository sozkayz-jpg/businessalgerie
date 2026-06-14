import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogCard } from "@/components/blog-card";
import { getAllBlogPosts } from "@/lib/blog";
import { type Locale } from "@/i18n/routing";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);

  const t = await getTranslations("blog");
  const posts = getAllBlogPosts();

  return (
    <>
      <section className="bg-brand-soft py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              {t("page_title")}
            </h1>
            <p className="mt-4 text-lg text-brand-text">
              {t("page_subtitle")}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} locale={typedLocale} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
