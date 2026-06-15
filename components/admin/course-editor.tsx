"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeoPanel } from "@/components/admin/seo-panel";
import type { Course, SeoMeta, CourseProgram } from "@/lib/cms/types";
import type { Locale } from "@/i18n/routing";
import { Loader2, Save, ArrowLeft, Image } from "lucide-react";

const LOCALES: Locale[] = ["fr", "ar", "en"];

function parseArray(value: string): string[] {
  try {
    return JSON.parse(value);
  } catch {
    return value.split("\n").filter(Boolean);
  }
}

function stringifyArray(value: string[]): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

function parseProgram(value: string): CourseProgram[] {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

function stringifyProgram(value: CourseProgram[]): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

export function CourseEditor({ course }: { course: Course }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<Locale>("fr");
  const [title, setTitle] = React.useState(course.title);
  const [description, setDescription] = React.useState(course.description);
  const [learn, setLearn] = React.useState<Record<Locale, string[]>>(course.learn);
  const [program, setProgram] = React.useState<Record<Locale, CourseProgram[]>>(course.program);
  const [meta, setMeta] = React.useState<Record<Locale, SeoMeta>>(course.meta);
  const [price, setPrice] = React.useState(course.price_dzd);
  const [flagship, setFlagship] = React.useState(course.is_flagship);
  const [published, setPublished] = React.useState(course.published);
  const [image, setImage] = React.useState(course.image || "");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

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
    setStatus("loading");
    const res = await fetch(`/api/admin/courses/${course.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        learn,
        program,
        meta,
        price_dzd: price,
        is_flagship: flagship,
        published,
        image,
      }),
    });
    setStatus(res.ok ? "success" : "error");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/admin/courses")}>
          <ArrowLeft className="me-1 size-4" /> Retour
        </Button>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={flagship} onChange={(e) => setFlagship(e.target.checked)} />
            Formation phare
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Publiée
          </label>
          <Button onClick={save} disabled={status === "loading"}>
            {status === "loading" && <Loader2 className="me-2 size-4 animate-spin" />}
            <Save className="me-2 size-4" /> Enregistrer
          </Button>
        </div>
      </div>

      {status === "success" && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">Formation enregistrée.</div>}
      {status === "error" && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">Erreur lors de l'enregistrement.</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Prix (DZD)</Label>
          <Input type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value) || 0)} />
        </div>
        <div className="space-y-2">
          <Label>Image</Label>
          <div className="flex items-center gap-2">
            <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="/images/formation.webp" />
            <Label className="cursor-pointer">
              <Input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
              <span className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-muted">
                <Image className="size-4" />
              </span>
            </Label>
          </div>
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
                <Label>Description ({l.toUpperCase()})</Label>
                <Textarea value={description[l]} onChange={(e) => updateLocalized(setDescription, l, e.target.value)} rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Ce que vous apprendrez ({l.toUpperCase()}) — JSON ou 1 élément par ligne</Label>
                <Textarea
                  value={stringifyArray(learn[l] || [])}
                  onChange={(e) => updateLocalized(setLearn, l, parseArray(e.target.value))}
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label>Programme ({l.toUpperCase()}) — JSON</Label>
                <Textarea
                  value={stringifyProgram(program[l] || [])}
                  onChange={(e) => updateLocalized(setProgram, l, parseProgram(e.target.value))}
                  rows={10}
                />
              </div>
            </div>

            <SeoPanel
              meta={meta[l] || {}}
              onChange={(patch) => updateMeta(l, patch)}
              title={meta[l]?.title || title[l]}
              description={meta[l]?.description || description[l]}
              slug={course.slug}
              keywords={meta[l]?.keywords || []}
              blocks={[]}
              locale={l}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
