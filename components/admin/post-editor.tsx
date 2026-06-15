"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockEditor } from "@/components/block-editor";
import { SeoPanel } from "@/components/admin/seo-panel";
import type { BlogPost, Block, SeoMeta, BlogPostStatus } from "@/lib/cms/types";
import type { Locale } from "@/i18n/routing";
import { Loader2, Save, ArrowLeft, Image } from "lucide-react";

const LOCALES: Locale[] = ["fr", "ar", "en"];

export function PostEditor({ post }: { post: BlogPost }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<Locale>("fr");
  const [title, setTitle] = React.useState(post.title);
  const [excerpt, setExcerpt] = React.useState(post.excerpt);
  const [category, setCategory] = React.useState(post.category);
  const [content, setContent] = React.useState<Record<Locale, Block[]>>(post.content);
  const [meta, setMeta] = React.useState<Record<Locale, SeoMeta>>(post.meta);
  const [status, setStatus] = React.useState<BlogPostStatus>(post.status);
  const [author, setAuthor] = React.useState(post.author);
  const [readingTime, setReadingTime] = React.useState(post.reading_time);
  const [image, setImage] = React.useState(post.image || "");
  const [videoId, setVideoId] = React.useState(post.video_id || "");
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  const updateLocalized = <T extends Record<Locale, any>>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    locale: Locale,
    value: any
  ) => {
    setter((prev: T) => ({ ...prev, [locale]: value }));
  };

  const updateMeta = (l: Locale, patch: Partial<SeoMeta>) => {
    setMeta((prev) => ({ ...prev, [l]: { ...prev[l], ...patch } }));
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.ok) setImage(data.url);
  };

  const save = async () => {
    setSaveStatus("loading");
    const publishedAt = status === "published" ? post.published_at || new Date().toISOString() : post.published_at;
    const res = await fetch(`/api/admin/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        excerpt,
        category,
        content,
        meta,
        status,
        author,
        reading_time: readingTime,
        image,
        video_id: videoId,
        published_at: publishedAt,
      }),
    });
    setSaveStatus(res.ok ? "success" : "error");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/admin/blog")}>
          <ArrowLeft className="me-1 size-4" /> Retour
        </Button>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BlogPostStatus)}
            className="rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="scheduled">Planifié</option>
          </select>
          <Button onClick={save} disabled={saveStatus === "loading"}>
            {saveStatus === "loading" && <Loader2 className="me-2 size-4 animate-spin" />}
            <Save className="me-2 size-4" /> Enregistrer
          </Button>
        </div>
      </div>

      {saveStatus === "success" && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">Article enregistré.</div>}
      {saveStatus === "error" && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">Erreur lors de l'enregistrement.</div>}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Auteur</Label>
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Temps de lecture (min)</Label>
          <Input type="number" value={readingTime} onChange={(e) => setReadingTime(parseInt(e.target.value) || 0)} />
        </div>
        <div className="space-y-2">
          <Label>Vidéo YouTube ID</Label>
          <Input value={videoId} onChange={(e) => setVideoId(e.target.value)} placeholder="dQw4w9WgXcQ" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Image à la une</Label>
        <div className="flex items-center gap-2">
          <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="/images/article.webp" />
          <Label className="cursor-pointer">
            <Input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
            <span className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-muted">
              <Image className="size-4" />
            </span>
          </Label>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Locale)}>
        <TabsList>
          {LOCALES.map((l) => (
            <TabsTrigger key={l} value={l}>{l.toUpperCase()}</TabsTrigger>
          ))}
        </TabsList>

        {LOCALES.map((l) => (
          <TabsContent key={l} value={l} className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Titre ({l.toUpperCase()})</Label>
                <Input value={title[l]} onChange={(e) => updateLocalized(setTitle, l, e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Extrait ({l.toUpperCase()})</Label>
                <Textarea value={excerpt[l]} onChange={(e) => updateLocalized(setExcerpt, l, e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Catégorie ({l.toUpperCase()})</Label>
                <Input value={category[l]} onChange={(e) => updateLocalized(setCategory, l, e.target.value)} />
              </div>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <h2 className="mb-4 font-heading text-lg font-semibold">Contenu ({l.toUpperCase()})</h2>
              <BlockEditor
                blocks={content[l] || []}
                onChange={(next) => updateLocalized(setContent, l, next)}
              />
            </div>

            <SeoPanel
              meta={meta[l] || {}}
              onChange={(patch) => updateMeta(l, patch)}
              title={meta[l]?.title || title[l]}
              description={meta[l]?.description || excerpt[l]}
              slug={post.slug}
              keywords={meta[l]?.keywords || []}
              blocks={content[l] || []}
              locale={l}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
