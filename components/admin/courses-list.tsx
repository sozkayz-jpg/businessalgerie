"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Course } from "@/lib/cms/types";
import type { Locale } from "@/i18n/routing";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";

export function CoursesList({ courses, locale }: { courses: Course[]; locale: Locale }) {
  const router = useRouter();
  const [items, setItems] = React.useState(courses);
  const [newSlug, setNewSlug] = React.useState("");

  const create = async () => {
    if (!newSlug.trim()) return;
    const empty = { fr: "", ar: "", en: "" };
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: newSlug.trim(),
        title: empty,
        price_dzd: 0,
        description: empty,
        learn: { fr: [], ar: [], en: [] },
        program: { fr: [], ar: [], en: [] },
        meta: { fr: {}, ar: {}, en: {} },
        published: false,
      }),
    });
    const data = await res.json();
    if (data.ok) router.push(`/admin/courses/${data.course.id}`);
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette formation ?")) return;
    const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="slug-formation" />
        <Button onClick={create}>
          <Plus className="me-1 size-4" /> Créer
        </Button>
      </div>
      <div className="rounded-xl border bg-card shadow-sm">
        {items.map((course) => (
          <div key={course.id} className="flex items-center justify-between border-b p-4 last:border-b-0">
            <div className="space-y-1">
              <p className="font-medium">{course.title.fr || course.slug}</p>
              <p className="text-xs text-brand-text">{course.price_dzd.toLocaleString()} DA · {course.published ? "Publiée" : "Brouillon"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/${locale}/formations/${course.slug}`} target="_blank" className="text-brand-text hover:text-primary">
                <ExternalLink className="size-4" />
              </Link>
              <Link href={`/admin/courses/${course.id}`} locale={locale}>
                <Button variant="ghost" size="icon-sm">
                  <Pencil className="size-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon-sm" onClick={() => remove(course.id)}>
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
