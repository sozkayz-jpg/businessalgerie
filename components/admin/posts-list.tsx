"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BlogPost } from "@/lib/cms/types";
import type { Locale } from "@/i18n/routing";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";

export function PostsList({ posts, locale }: { posts: BlogPost[]; locale: Locale }) {
  const router = useRouter();
  const [items, setItems] = React.useState(posts);
  const [newSlug, setNewSlug] = React.useState("");

  const create = async () => {
    if (!newSlug.trim()) return;
    const empty = { fr: "", ar: "", en: "" };
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: newSlug.trim(),
        status: "draft",
        title: empty,
        excerpt: empty,
        category: empty,
        content: { fr: [], ar: [], en: [] },
        meta: { fr: {}, ar: {}, en: {} },
        author: "",
        reading_time: 5,
      }),
    });
    const data = await res.json();
    if (data.ok) router.push(`/admin/blog/${data.post.id}`);
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="slug-article" />
        <Button onClick={create}>
          <Plus className="me-1 size-4" /> Créer
        </Button>
      </div>
      <div className="rounded-xl border bg-card shadow-sm">
        {items.map((post) => (
          <div key={post.id} className="flex items-center justify-between border-b p-4 last:border-b-0">
            <div className="space-y-1">
              <p className="font-medium">{post.title.fr || post.slug}</p>
              <p className="text-xs text-brand-text">{post.status} · {post.published_at ? new Date(post.published_at).toLocaleDateString() : "—"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/${locale}/blog/${post.slug}`} target="_blank" className="text-brand-text hover:text-primary">
                <ExternalLink className="size-4" />
              </Link>
              <Link href={`/admin/blog/${post.id}`} locale={locale}>
                <Button variant="ghost" size="icon-sm">
                  <Pencil className="size-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon-sm" onClick={() => remove(post.id)}>
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
