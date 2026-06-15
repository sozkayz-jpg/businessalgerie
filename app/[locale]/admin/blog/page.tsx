import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllPostsAdmin } from "@/lib/cms/posts";
import { PostsList } from "@/components/admin/posts-list";
import { type Locale } from "@/i18n/routing";

export default async function AdminBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);
  const t = await getTranslations("admin");
  const posts = await getAllPostsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">{t("blog.title")}</h1>
        <p className="text-brand-text">{t("blog.subtitle")}</p>
      </div>
      <PostsList posts={posts} locale={typedLocale} />
    </div>
  );
}
