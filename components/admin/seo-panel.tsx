"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { SeoMeta, Block, SeoAnalysis } from "@/lib/cms/types";
import type { Locale } from "@/i18n/routing";
import { Search, CheckCircle, AlertCircle, XCircle, Loader2 } from "lucide-react";

export function SeoPanel({
  meta,
  onChange,
  title,
  description,
  slug,
  keywords,
  blocks,
  locale,
}: {
  meta: SeoMeta;
  onChange: (patch: Partial<SeoMeta>) => void;
  title: string;
  description: string;
  slug: string;
  keywords: string[];
  blocks: Block[];
  locale: Locale;
}) {
  const [analysis, setAnalysis] = React.useState<SeoAnalysis | null>(null);
  const [loading, setLoading] = React.useState(false);

  const analyze = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/seo/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: meta.title || title,
        description: meta.description || description,
        slug,
        keywords: meta.keywords || keywords,
        blocks,
        locale,
      }),
    });
    const data = await res.json();
    setAnalysis(data.analysis);
    setLoading(false);
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="mb-4 font-heading text-lg font-semibold">SEO / GEO</h2>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>Meta title</Label>
          <Input
            value={meta.title || ""}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder={title}
          />
        </div>
        <div className="space-y-2">
          <Label>Meta description</Label>
          <Textarea
            value={meta.description || ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder={description}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label>Mots-clés (séparés par des virgules)</Label>
          <Input
            value={(meta.keywords || keywords).join(", ")}
            onChange={(e) =>
              onChange({
                keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Image Open Graph</Label>
          <Input
            value={meta.ogImage || ""}
            onChange={(e) => onChange({ ogImage: e.target.value })}
            placeholder="/images/hero.webp"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={meta.noIndex || false}
              onChange={(e) => onChange({ noIndex: e.target.checked })}
            />
            No index
          </Label>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading font-semibold">Analyse SEO/GEO</h3>
          <Button type="button" variant="outline" size="sm" onClick={analyze} disabled={loading}>
            {loading && <Loader2 className="me-1 size-4 animate-spin" />}
            <Search className="me-1 size-4" /> Analyser
          </Button>
        </div>

        {analysis && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`text-3xl font-bold ${scoreColor(analysis.score)}`}>{analysis.score}/100</span>
              <span className="text-sm text-brand-text">Score global</span>
            </div>
            <div className="space-y-2">
              {analysis.checks.map((check) => (
                <div key={check.id} className="flex items-start gap-2 text-sm">
                  {check.status === "pass" && <CheckCircle className="mt-0.5 size-4 shrink-0 text-green-600" />}
                  {check.status === "warn" && <AlertCircle className="mt-0.5 size-4 shrink-0 text-yellow-600" />}
                  {check.status === "fail" && <XCircle className="mt-0.5 size-4 shrink-0 text-red-600" />}
                  <div>
                    <p className="font-medium">{check.label}</p>
                    <p className="text-brand-text">{check.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
