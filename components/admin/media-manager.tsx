"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MediaItem } from "@/lib/cms/types";
import { Upload, Copy, Check } from "lucide-react";

export function MediaManager({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [media, setMedia] = React.useState(initialMedia);
  const [copied, setCopied] = React.useState<string | null>(null);

  const upload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.ok) {
      const newItem: MediaItem = {
        id: crypto.randomUUID(),
        name: file.name,
        url: data.url,
        content_type: file.type,
        size: file.size,
        created_at: new Date().toISOString(),
      };
      setMedia((prev) => [newItem, ...prev]);
    }
  };

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-4">
      <Label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted">
        <Upload className="size-4" /> Télécharger une image
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
      </Label>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="relative aspect-video w-full">
              <Image src={item.url} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-medium">{item.name}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 h-auto px-2 py-1 text-xs"
                onClick={() => copy(item.url)}
              >
                {copied === item.url ? <Check className="me-1 size-3" /> : <Copy className="me-1 size-3" />}
                {copied === item.url ? "Copié" : "Copier l'URL"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
