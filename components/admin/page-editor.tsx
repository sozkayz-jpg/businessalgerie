"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockEditor } from "@/components/block-editor";
import { SeoPanel } from "@/components/admin/seo-panel";
import type { Page, Block, SeoMeta } from "@/lib/cms/types";
import type { Locale } from "@/i18n/routing";
import { Loader2, Save, ArrowLeft } from "lucide-react";

const LOCALES: Locale[] = ["fr", "ar", "en"];

export function PageEditor({ page, locale }: { page: Page; locale: Locale }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<Locale>(locale);
  const [blocks, setBlocks] = React.useState<Record<Locale, Block[]>>(page.blocks);
  const [meta, setMeta] = React.useState<Record<Locale, SeoMeta>>(page.meta);
  const [published, setPublished] = React.useState(page.published);
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  const updateMeta = (l: Locale, patch: Partial<SeoMeta>) => {
    setMeta((prev) => ({ ...prev, [l]: { ...prev[l], ...patch } }));
  };

  const save = async () => {
    setStatus("loading");
    const res = await fetch(`/api/admin/pages/${page.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks, meta, published }),
    });
    setStatus(res.ok ? "success" : "error");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/admin/pages")}>
          <ArrowLeft className="me-1 size-4" /> Retour
        </Button>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publiée
          </label>
          <Button onClick={save} disabled={status === "loading"}>
            {status === "loading" && <Loader2 className="me-2 size-4 animate-spin" />}
            <Save className="me-2 size-4" /> Enregistrer
          </Button>
        </div>
      </div>

      {status === "success" && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">Page enregistrée.</div>}
      {status === "error" && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">Erreur lors de l'enregistrement.</div>}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Locale)}>
        <TabsList>
          {LOCALES.map((l) => (
            <TabsTrigger key={l} value={l}>{l.toUpperCase()}</TabsTrigger>
          ))}
        </TabsList>

        {LOCALES.map((l) => (
          <TabsContent key={l} value={l} className="space-y-6">
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <h2 className="mb-4 font-heading text-lg font-semibold">Blocs de contenu ({l.toUpperCase()})</h2>
              <BlockEditor
                blocks={blocks[l] || []}
                onChange={(next) => setBlocks((prev) => ({ ...prev, [l]: next }))}
              />
            </div>

            <SeoPanel
              meta={meta[l] || {}}
              onChange={(patch) => updateMeta(l, patch)}
              title={meta[l]?.title || ""}
              description={meta[l]?.description || ""}
              slug={page.slug}
              keywords={meta[l]?.keywords || []}
              blocks={blocks[l] || []}
              locale={l}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
