import type { Block, SeoAnalysis, SeoCheck } from "./types";
import type { Locale } from "@/i18n/routing";

function extractTextFromBlocks(blocks: Block[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    if (block.props?.text) parts.push(block.props.text);
    if (block.props?.title) parts.push(block.props.title);
    if (block.props?.subtitle) parts.push(block.props.subtitle);
    if (block.props?.content?.content) {
      // Tiptap doc
      const doc = block.props.content;
      if (doc?.content) {
        for (const node of doc.content) {
          extractTextFromTipTapNode(node, parts);
        }
      }
    }
    if (block.props?.items) {
      for (const item of block.props.items) {
        if (typeof item === "string") parts.push(item);
        else if (item?.title) parts.push(item.title, item.description || "");
        else if (item?.question) parts.push(item.question, item.answer || "");
      }
    }
  }
  return parts.join(" ");
}

function extractTextFromTipTapNode(node: any, parts: string[]) {
  if (!node) return;
  if (node.text) parts.push(node.text);
  if (node.content) {
    for (const child of node.content) extractTextFromTipTapNode(child, parts);
  }
  if (node.attrs?.alt) parts.push(node.attrs.alt);
}

function extractHeadings(blocks: Block[]) {
  const headings: { level: number; text: string }[] = [];
  for (const block of blocks) {
    if (block.type === "heading" || block.props?.level) {
      const level = block.props?.level || 2;
      const text = block.props?.text || "";
      if (text) headings.push({ level, text });
    }
    if (block.props?.content?.content) {
      for (const node of block.props.content.content) {
        if (["heading"].includes(node.type) && node.attrs?.level) {
          const text = extractTextFromTipTapNodeValue(node);
          if (text) headings.push({ level: node.attrs.level, text });
        }
      }
    }
  }
  return headings;
}

function extractTextFromTipTapNodeValue(node: any): string {
  if (!node) return "";
  if (node.text) return node.text;
  if (node.content) return node.content.map(extractTextFromTipTapNodeValue).join("");
  return "";
}

function countOccurrences(text: string, keyword: string): number {
  const normalized = text.toLowerCase();
  const kw = keyword.toLowerCase();
  let count = 0;
  let pos = 0;
  while ((pos = normalized.indexOf(kw, pos)) !== -1) {
    count++;
    pos += kw.length;
  }
  return count;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length || 0;
}

function hasInternalLinks(blocks: Block[]): boolean {
  const text = JSON.stringify(blocks);
  return /href["']?:\s*["']\//.test(text);
}

function imagesWithAlt(blocks: Block[]) {
  const total: { src?: string; alt?: string }[] = [];
  for (const block of blocks) {
    if (block.type === "image" && block.props?.src) {
      total.push({ src: block.props.src, alt: block.props.alt || "" });
    }
    if (block.props?.content?.content) {
      for (const node of block.props.content.content) {
        if (node.type === "image") {
          total.push({ src: node.attrs?.src, alt: node.attrs?.alt || "" });
        }
      }
    }
  }
  return total;
}

export function analyzeSEO(
  title: string,
  description: string,
  slug: string,
  keywords: string[],
  blocks: Block[],
  locale: Locale
): SeoAnalysis {
  const contentText = extractTextFromBlocks(blocks);
  const fullText = `${title} ${description} ${contentText}`;
  const headings = extractHeadings(blocks);
  const images = imagesWithAlt(blocks);
  const wc = wordCount(contentText);

  const primaryKeyword = keywords[0] || "";

  const checks: SeoCheck[] = [
    {
      id: "title_length",
      label: "Longueur du title",
      status: title.length >= 30 && title.length <= 60 ? "pass" : title.length > 60 ? "warn" : "fail",
      message:
        title.length >= 30 && title.length <= 60
          ? "Title idéal."
          : title.length > 60
          ? "Title un peu long."
          : "Title trop court.",
      points: title.length >= 30 && title.length <= 60 ? 10 : title.length > 60 ? 5 : 2,
    },
    {
      id: "description_length",
      label: "Longueur de la meta description",
      status:
        description.length >= 120 && description.length <= 160
          ? "pass"
          : description.length > 160
          ? "warn"
          : "fail",
      message:
        description.length >= 120 && description.length <= 160
          ? "Description idéale."
          : description.length > 160
          ? "Description trop longue."
          : "Description trop courte.",
      points:
        description.length >= 120 && description.length <= 160 ? 10 : description.length > 160 ? 5 : 2,
    },
    {
      id: "keyword_in_title",
      label: "Mot-clé principal dans le title",
      status: primaryKeyword && title.toLowerCase().includes(primaryKeyword.toLowerCase()) ? "pass" : "warn",
      message: primaryKeyword
        ? title.toLowerCase().includes(primaryKeyword.toLowerCase())
          ? "Le mot-clé est dans le title."
          : "Ajoutez le mot-clé principal au title."
        : "Aucun mot-clé principal défini.",
      points: primaryKeyword && title.toLowerCase().includes(primaryKeyword.toLowerCase()) ? 10 : 0,
    },
    {
      id: "keyword_in_description",
      label: "Mot-clé principal dans la description",
      status:
        primaryKeyword && description.toLowerCase().includes(primaryKeyword.toLowerCase())
          ? "pass"
          : "warn",
      message: primaryKeyword
        ? description.toLowerCase().includes(primaryKeyword.toLowerCase())
          ? "Le mot-clé est dans la description."
          : "Ajoutez le mot-clé principal à la description."
        : "Aucun mot-clé principal défini.",
      points: primaryKeyword && description.toLowerCase().includes(primaryKeyword.toLowerCase()) ? 8 : 0,
    },
    {
      id: "content_length",
      label: "Longueur du contenu",
      status: wc >= 300 ? "pass" : wc >= 150 ? "warn" : "fail",
      message: wc >= 300 ? "Contenu suffisant." : wc >= 150 ? "Contenu acceptable." : "Contenu trop court.",
      points: wc >= 300 ? 10 : wc >= 150 ? 5 : 2,
    },
    {
      id: "keyword_density",
      label: "Densité du mot-clé principal",
      status: "pass",
      message: "Densité acceptable.",
      points: 5,
    },
    {
      id: "headings_structure",
      label: "Structure des titres",
      status: headings.length >= 2 ? "pass" : "warn",
      message: headings.length >= 2 ? "Structure claire." : "Ajoutez des sous-titres H2/H3.",
      points: headings.length >= 2 ? 10 : 4,
    },
    {
      id: "internal_links",
      label: "Liens internes",
      status: hasInternalLinks(blocks) ? "pass" : "warn",
      message: hasInternalLinks(blocks)
        ? "Liens internes détectés."
        : "Ajoutez des liens vers d'autres pages du site.",
      points: hasInternalLinks(blocks) ? 8 : 0,
    },
    {
      id: "images_alt",
      label: "Images avec texte alternatif",
      status: images.length === 0 ? "pass" : images.every((i) => i.alt?.trim()) ? "pass" : "warn",
      message:
        images.length === 0
          ? "Aucune image."
          : images.every((i) => i.alt?.trim())
          ? "Toutes les images ont un alt."
          : "Certaines images manquent de texte alternatif.",
      points: images.length === 0 ? 5 : images.every((i) => i.alt?.trim()) ? 10 : 3,
    },
    {
      id: "geo_local_signals",
      label: "Signaux GEO (Algérie)",
      status: /alg[eé]rie|algeria|alger|oran|constantine|dz/i.test(fullText) ? "pass" : "warn",
      message: /alg[eé]rie|algeria|alger|oran|constantine|dz/i.test(fullText)
        ? "Signaux locaux présents."
        : "Mentionnez l'Algérie ou une ville pour le GEO.",
      points: /alg[eé]rie|algeria|alger|oran|constantine|dz/i.test(fullText) ? 10 : 0,
    },
  ];

  // Adjust keyword density check
  if (primaryKeyword && wc > 0) {
    const occurrences = countOccurrences(contentText, primaryKeyword);
    const density = (occurrences / wc) * 100;
    const densityCheck = checks.find((c) => c.id === "keyword_density")!;
    densityCheck.status = density >= 0.5 && density <= 2 ? "pass" : density > 2 ? "warn" : "warn";
    densityCheck.message =
      density >= 0.5 && density <= 2
        ? `Densité ${density.toFixed(1)}% — idéal.`
        : density > 2
        ? `Densité ${density.toFixed(1)}% — trop élevée.`
        : `Densité ${density.toFixed(1)}% — insuffisante.`;
    densityCheck.points = density >= 0.5 && density <= 2 ? 8 : 2;
  }

  const totalPoints = checks.reduce((sum, c) => sum + c.points, 0);
  const maxPoints = checks.length * 10;
  const score = Math.round((totalPoints / maxPoints) * 100);

  return { score, checks };
}
