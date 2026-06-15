import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPostByIdAdmin } from "@/lib/cms/posts";
import { PostEditor } from "@/components/admin/post-editor";
import { type Locale } from "@/i18n/routing";

export default async function AdminPostEditorPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);
  const t = await getTranslations("admin");
  const post = await getPostByIdAdmin(id);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">{t("blog.edit")}</h1>
        <p className="text-brand-text">{post.slug}</p>
      </div>
      <PostEditor post={post} />
    </div>
  );
}
