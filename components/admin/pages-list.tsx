"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Page } from "@/lib/cms/types";
import type { Locale } from "@/i18n/routing";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";

export function PagesList({ pages, locale }: { pages: Page[]; locale: Locale }) {
  const [items, setItems] = React.useState(pages);
  const [newSlug, setNewSlug] = React.useState("");

  const create = async () => {
    if (!newSlug.trim()) return;
    const res = await fetch("/api/admin/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: newSlug.trim(),
        is_system: false,
        meta: { fr: {}, ar: {}, en: {} },
        blocks: { fr: [], ar: [], en: [] },
        published: false,
      }),
    });
    const data = await res.json();
    if (data.ok) {
      setItems((prev) => [...prev, data.page]);
      setNewSlug("");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette page ?")) return;
    const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          value={newSlug}
          onChange={(e) => setNewSlug(e.target.value)}
          placeholder="slug-de-la-page"
        />
        <Button onClick={create}>
          <Plus className="me-1 size-4" />
          Créer
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        {items.map((page) => (
          <div
            key={page.id}
            className="flex items-center justify-between border-b p-4 last:border-b-0"
          >
            <div className="space-y-1">
              <p className="font-medium">{page.slug}</p>
              <p className="text-xs text-brand-text">
                {page.is_system ? "Système" : "Personnalisée"} ·{" "}
                {page.published ? "Publiée" : "Brouillon"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/${locale}${page.slug === "home" ? "" : `/${page.slug}`}`}
                target="_blank"
                className="text-brand-text hover:text-primary"
              >
                <ExternalLink className="size-4" />
              </Link>
              <Link href={`/admin/pages/${page.id}`} locale={locale}>
                <Button variant="ghost" size="icon-sm">
                  <Pencil className="size-4" />
                </Button>
              </Link>
              {!page.is_system && (
                <Button variant="ghost" size="icon-sm" onClick={() => remove(page.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
