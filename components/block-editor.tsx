"use client";

import * as React from "react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/blocks/richtext-editor";
import type { Block, BlockType } from "@/lib/cms/types";
import { GripVertical, Trash2, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const BLOCK_TYPES: { value: BlockType; label: string }[] = [
  { value: "hero", label: "Hero (accueil)" },
  { value: "problem", label: "Section Problème" },
  { value: "solution", label: "Section Solution" },
  { value: "courses_preview", label: "Aperçu formations" },
  { value: "testimonial", label: "Témoignages" },
  { value: "faq", label: "FAQ" },
  { value: "cta", label: "Appel à l'action" },
  { value: "newsletter", label: "Newsletter" },
  { value: "contact_form", label: "Formulaire de contact" },
  { value: "services_grid", label: "Grille services" },
  { value: "services_cards", label: "Cartes services" },
  { value: "course_grid", label: "Grille formations" },
  { value: "blog_grid", label: "Grille articles" },
  { value: "about_cards", label: "Cartes à propos" },
  { value: "heading", label: "Titre" },
  { value: "paragraph", label: "Paragraphe" },
  { value: "rich_text", label: "Texte riche" },
  { value: "image", label: "Image" },
  { value: "video", label: "Vidéo YouTube" },
  { value: "button", label: "Bouton" },
  { value: "quote", label: "Citation" },
  { value: "list", label: "Liste" },
  { value: "divider", label: "Séparateur" },
];

const DEFAULT_PROPS: Record<BlockType, Record<string, any>> = {
  hero: {
    eyebrow: "",
    title: "",
    subtitle: "",
    ctaPrimary: "",
    ctaPrimaryHref: "/formations",
    ctaSecondary: "",
    ctaSecondaryHref: "/contact",
    videoHint: "",
    image: "",
  },
  problem: { eyebrow: "", title: "", subtitle: "", items: [] },
  solution: { eyebrow: "", title: "", subtitle: "", items: [], ctaPrimary: "", ctaSecondary: "" },
  courses_preview: { eyebrow: "", title: "", subtitle: "", ctaAll: "", limit: 3 },
  testimonial: { eyebrow: "", title: "", items: [] },
  faq: { eyebrow: "", title: "", items: [] },
  cta: { title: "", subtitle: "", ctaPrimary: "", ctaSecondary: "" },
  newsletter: { title: "", subtitle: "", placeholder: "", button: "" },
  contact_form: {},
  services_grid: { services: [] },
  services_cards: { items: [] },
  course_grid: {},
  blog_grid: {},
  columns: { columns: 2, children: [] },
  about_cards: { missionTitle: "", missionDesc: "", storyTitle: "", storyDesc: "", teamTitle: "", teamDesc: "" },
  heading: { level: 2, text: "" },
  paragraph: { text: "" },
  rich_text: { content: { type: "doc", content: [{ type: "paragraph" }] } },
  image: { src: "", alt: "" },
  video: { videoId: "", title: "" },
  button: { text: "", href: "", variant: "primary", size: "default", showArrow: false, align: "start" },
  quote: { text: "", author: "" },
  list: { ordered: false, items: [] },
  divider: {},
};

function parseItems(value: string): any[] {
  try {
    return JSON.parse(value);
  } catch {
    return value.split("\n").filter(Boolean).map((line) => ({ title: line, description: "" }));
  }
}

function stringifyItems(items: any[]): string {
  if (!items) return "";
  try {
    return JSON.stringify(items, null, 2);
  } catch {
    return "";
  }
}

export function BlockEditor({ blocks, onChange }: { blocks: Block[]; onChange: (blocks: Block[]) => void }) {
  const updateBlock = (index: number, updates: Partial<Block>) => {
    const next = [...blocks];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  const updateProps = (index: number, patch: Record<string, any>) => {
    const next = [...blocks];
    next[index] = { ...next[index], props: { ...next[index].props, ...patch } };
    onChange(next);
  };

  const addBlock = (type: BlockType, index?: number) => {
    const newBlock: Block = { id: nanoid(), type, props: { ...DEFAULT_PROPS[type] } };
    const next = [...blocks];
    const insertAt = typeof index === "number" ? index + 1 : next.length;
    next.splice(insertAt, 0, newBlock);
    onChange(next);
  };

  const removeBlock = (index: number) => {
    const next = [...blocks];
    next.splice(index, 1);
    onChange(next);
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const next = [...blocks];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <BlockItem
          key={block.id}
          block={block}
          index={index}
          total={blocks.length}
          onUpdateBlock={updateBlock}
          onUpdateProps={updateProps}
          onAdd={() => addBlock("paragraph", index)}
          onRemove={() => removeBlock(index)}
          onMoveUp={() => moveBlock(index, -1)}
          onMoveDown={() => moveBlock(index, 1)}
        />
      ))}
      <div className="flex items-center gap-2">
        <Select onValueChange={(value) => addBlock(value as BlockType)}>
          <SelectTrigger className="w-[260px]">
            <SelectValue placeholder="Ajouter un bloc" />
          </SelectTrigger>
          <SelectContent>
            {BLOCK_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" size="sm" onClick={() => addBlock("paragraph")}>
          <Plus className="me-1 size-4" />
          Ajouter
        </Button>
      </div>
    </div>
  );
}

function BlockItem({
  block,
  index,
  total,
  onUpdateBlock,
  onUpdateProps,
  onAdd,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  block: Block;
  index: number;
  total: number;
  onUpdateBlock: (i: number, u: Partial<Block>) => void;
  onUpdateProps: (i: number, p: Record<string, any>) => void;
  onAdd: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const p = block.props;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GripVertical className="size-4 text-muted-foreground" />
          <Select
            value={block.type}
            onValueChange={(value) => onUpdateBlock(index, { type: value as BlockType, props: { ...DEFAULT_PROPS[value as BlockType] } })}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BLOCK_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon-xs" onClick={onMoveUp} disabled={index === 0}>
            <ChevronUp className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon-xs" onClick={onMoveDown} disabled={index === total - 1}>
            <ChevronDown className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon-xs" onClick={onAdd}>
            <Plus className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon-xs" className="text-destructive" onClick={onRemove}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <BlockFields block={block} onChange={(patch) => onUpdateProps(index, patch)} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}

function BlockFields({ block, onChange }: { block: Block; onChange: (p: Record<string, any>) => void }) {
  const p = block.props;

  const commonText = (key: string, label: string, placeholder?: string) => (
    <Field key={key} label={label}>
      <Input
        value={p[key] || ""}
        onChange={(e) => onChange({ [key]: e.target.value })}
        placeholder={placeholder}
      />
    </Field>
  );

  const commonTextarea = (key: string, label: string, rows = 3) => (
    <Field key={key} label={label}>
      <Textarea value={p[key] || ""} onChange={(e) => onChange({ [key]: e.target.value })} rows={rows} />
    </Field>
  );

  const itemsArea = (key: string, label: string) => (
    <Field key={key} label={`${label} (JSON ou 1 titre par ligne)`}>
      <Textarea
        value={stringifyItems(p[key])}
        onChange={(e) => onChange({ [key]: parseItems(e.target.value) })}
        rows={6}
      />
    </Field>
  );

  switch (block.type) {
    case "hero":
      return (
        <div className="grid gap-3">
          {commonText("eyebrow", "Surtitre")}
          {commonText("title", "Titre")}
          {commonTextarea("subtitle", "Sous-titre")}
          {commonText("ctaPrimary", "CTA principal")}
          {commonText("ctaPrimaryHref", "Lien CTA principal")}
          {commonText("ctaSecondary", "CTA secondaire")}
          {commonText("ctaSecondaryHref", "Lien CTA secondaire")}
          {commonText("videoHint", "Indication vidéo")}
          {commonText("image", "URL image")}
        </div>
      );
    case "problem":
    case "solution":
      return (
        <div className="grid gap-3">
          {commonText("eyebrow", "Surtitre")}
          {commonText("title", "Titre")}
          {commonTextarea("subtitle", "Sous-titre")}
          {itemsArea("items", "Éléments")}
          {commonText("ctaPrimary", "CTA principal")}
          {commonText("ctaSecondary", "CTA secondaire")}
        </div>
      );
    case "courses_preview":
      return (
        <div className="grid gap-3">
          {commonText("eyebrow", "Surtitre")}
          {commonText("title", "Titre")}
          {commonTextarea("subtitle", "Sous-titre")}
          {commonText("ctaAll", "CTA tout voir")}
        </div>
      );
    case "testimonial":
    case "faq":
      return (
        <div className="grid gap-3">
          {commonText("eyebrow", "Surtitre")}
          {commonText("title", "Titre")}
          {itemsArea("items", "Éléments")}
        </div>
      );
    case "cta":
      return (
        <div className="grid gap-3">
          {commonText("title", "Titre")}
          {commonTextarea("subtitle", "Sous-titre")}
          {commonText("ctaPrimary", "CTA principal")}
          {commonText("ctaSecondary", "CTA secondaire")}
        </div>
      );
    case "newsletter":
      return (
        <div className="grid gap-3">
          {commonText("title", "Titre")}
          {commonTextarea("subtitle", "Sous-titre")}
          {commonText("placeholder", "Placeholder")}
          {commonText("button", "Bouton")}
        </div>
      );
    case "services_grid":
      return itemsArea("services", "Services");
    case "services_cards":
      return itemsArea("items", "Services");
    case "about_cards":
      return (
        <div className="grid gap-3">
          {commonText("missionTitle", "Titre mission")}
          {commonTextarea("missionDesc", "Description mission")}
          {commonText("storyTitle", "Titre histoire")}
          {commonTextarea("storyDesc", "Description histoire")}
          {commonText("teamTitle", "Titre équipe")}
          {commonTextarea("teamDesc", "Description équipe")}
        </div>
      );
    case "heading":
      return (
        <div className="grid gap-3">
          <Field label="Niveau">
            <Select value={String(p.level || 2)} onValueChange={(v) => onChange({ level: parseInt(v) })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((l) => (
                  <SelectItem key={l} value={String(l)}>H{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {commonText("text", "Texte")}
        </div>
      );
    case "paragraph":
      return commonTextarea("text", "Texte", 4);
    case "rich_text":
      return (
        <Field label="Contenu">
          <RichTextEditor
            value={p.content}
            onChange={(content) => onChange({ content })}
          />
        </Field>
      );
    case "image":
      return (
        <div className="grid gap-3">
          {commonText("src", "URL image")}
          {commonText("alt", "Texte alternatif")}
        </div>
      );
    case "video":
      return (
        <div className="grid gap-3">
          {commonText("videoId", "ID YouTube")}
          {commonText("title", "Titre")}
        </div>
      );
    case "button":
      return (
        <div className="grid gap-3">
          {commonText("text", "Texte")}
          {commonText("href", "Lien")}
          <Field label="Variante">
            <Select value={p.variant || "primary"} onValueChange={(v) => onChange({ variant: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primaire</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Alignement">
            <Select value={p.align || "start"} onValueChange={(v) => onChange({ align: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Gauche</SelectItem>
                <SelectItem value="center">Centre</SelectItem>
                <SelectItem value="end">Droite</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      );
    case "quote":
      return (
        <div className="grid gap-3">
          {commonTextarea("text", "Citation")}
          {commonText("author", "Auteur")}
        </div>
      );
    case "list":
      return (
        <div className="grid gap-3">
          <Field label="Type">
            <Select value={p.ordered ? "ordered" : "bullet"} onValueChange={(v) => onChange({ ordered: v === "ordered" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bullet">Puces</SelectItem>
                <SelectItem value="ordered">Numérotée</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Éléments (1 par ligne)">
            <Textarea
              value={(p.items || []).join("\n")}
              onChange={(e) => onChange({ items: e.target.value.split("\n").filter(Boolean) })}
              rows={6}
            />
          </Field>
        </div>
      );
    default:
      return null;
  }
}
