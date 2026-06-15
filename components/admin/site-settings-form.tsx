"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SiteSettings } from "@/lib/cms/types";
import type { Locale } from "@/i18n/routing";
import { Loader2, Save, Upload } from "lucide-react";

const LOCALES: Locale[] = ["fr", "ar", "en"];

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("admin.site");
  const [form, setForm] = React.useState<SiteSettings>(settings);
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  const updateLocalized = (
    field: "brand_name" | "tagline",
    locale: Locale,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], [locale]: value },
    }));
  };

  const updateColor = (key: keyof SiteSettings["colors"], value: string) => {
    setForm((prev) => ({ ...prev, colors: { ...prev.colors, [key]: value } }));
  };

  const updatePixel = (key: keyof SiteSettings["pixels"], value: string) => {
    setForm((prev) => ({ ...prev, pixels: { ...prev.pixels, [key]: value || undefined } }));
  };

  const updateAnalytics = (
    key: keyof SiteSettings["analytics"],
    value: string
  ) => {
    setForm((prev) => ({ ...prev, analytics: { ...prev.analytics, [key]: value || undefined } }));
  };

  const updateSocial = (key: keyof SiteSettings["social_links"], value: string) => {
    setForm((prev) => ({ ...prev, social_links: { ...prev.social_links, [key]: value || undefined } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "success" : "error");
  };

  const uploadFile = async (field: "logo_url" | "favicon_url", file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.ok) {
      setForm((prev) => ({ ...prev, [field]: data.url }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="brand">
        <TabsList>
          <TabsTrigger value="brand">{t("tabs.brand")}</TabsTrigger>
          <TabsTrigger value="design">{t("tabs.design")}</TabsTrigger>
          <TabsTrigger value="seo">{t("tabs.seo")}</TabsTrigger>
          <TabsTrigger value="integrations">{t("tabs.integrations")}</TabsTrigger>
        </TabsList>

        <TabsContent value="brand" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {LOCALES.map((locale) => (
              <div key={locale} className="space-y-2">
                <Label>{t("brand_name")} ({locale})</Label>
                <Input
                  value={form.brand_name[locale]}
                  onChange={(e) => updateLocalized("brand_name", locale, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {LOCALES.map((locale) => (
              <div key={locale} className="space-y-2">
                <Label>{t("tagline")} ({locale})</Label>
                <Input
                  value={form.tagline[locale]}
                  onChange={(e) => updateLocalized("tagline", locale, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("logo")}</Label>
              <div className="flex items-center gap-2">
                <Input value={form.logo_url || ""} readOnly placeholder={t("logo")} />
                <Label className="cursor-pointer">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadFile("logo_url", e.target.files[0])}
                  />
                  <span className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-muted">
                    <Upload className="size-4" />
                  </span>
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("favicon")}</Label>
              <div className="flex items-center gap-2">
                <Input value={form.favicon_url || ""} readOnly placeholder={t("favicon")} />
                <Label className="cursor-pointer">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadFile("favicon_url", e.target.files[0])}
                  />
                  <span className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-muted">
                    <Upload className="size-4" />
                  </span>
                </Label>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["facebook", "Facebook"],
              ["instagram", "Instagram"],
              ["linkedin", "LinkedIn"],
              ["youtube", "YouTube"],
              ["twitter", "X / Twitter"],
              ["tiktok", "TikTok"],
            ].map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label>{label}</Label>
                <Input
                  value={form.social_links[key as keyof SiteSettings["social_links"]] || ""}
                  onChange={(e) => updateSocial(key as keyof SiteSettings["social_links"], e.target.value)}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="design" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(form.colors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label className="capitalize">{key}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={value}
                    onChange={(e) => updateColor(key as keyof SiteSettings["colors"], e.target.value)}
                    className="h-10 w-12 p-1"
                  />
                  <Input
                    value={value}
                    onChange={(e) => updateColor(key as keyof SiteSettings["colors"], e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <div className="space-y-2">
            <Label>{t("titleTemplate")}</Label>
            <Input
              value={form.seo_default.titleTemplate}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  seo_default: { ...prev.seo_default, titleTemplate: e.target.value },
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>{t("defaultDescription")}</Label>
            <Input
              value={form.seo_default.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  seo_default: { ...prev.seo_default, description: e.target.value },
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>{t("defaultKeywords")}</Label>
            <Input
              value={form.seo_default.keywords.join(", ")}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  seo_default: {
                    ...prev.seo_default,
                    keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean),
                  },
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>{t("ogImage")}</Label>
            <Input
              value={form.seo_default.ogImageUrl}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  seo_default: { ...prev.seo_default, ogImageUrl: e.target.value },
                }))
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Meta Pixel ID</Label>
              <Input
                value={form.pixels.facebook || ""}
                onChange={(e) => updatePixel("facebook", e.target.value)}
                placeholder="1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label>TikTok Pixel ID</Label>
              <Input
                value={form.pixels.tiktok || ""}
                onChange={(e) => updatePixel("tiktok", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn Insight Tag ID</Label>
              <Input
                value={form.pixels.linkedin || ""}
                onChange={(e) => updatePixel("linkedin", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>GA4 Measurement ID</Label>
              <Input
                value={form.analytics.ga4MeasurementId || ""}
                onChange={(e) => updateAnalytics("ga4MeasurementId", e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label>Search Console HTML tag</Label>
              <Input
                value={form.analytics.searchConsoleHtmlTag || ""}
                onChange={(e) => updateAnalytics("searchConsoleHtmlTag", e.target.value)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" && <Loader2 className="me-2 size-4 animate-spin" />}
          <Save className="me-2 size-4" />
          {t("save")}
        </Button>
        {status === "success" && <span className="text-sm text-green-600">{t("saved")}</span>}
        {status === "error" && <span className="text-sm text-destructive">{t("error")}</span>}
      </div>
    </form>
  );
}
