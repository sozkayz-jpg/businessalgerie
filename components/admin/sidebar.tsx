"use client";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  FileText,
  BookOpen,
  GraduationCap,
  ShoppingCart,
  Image,
} from "lucide-react";
import type { Locale } from "@/i18n/routing";

const items = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/site", label: "Site & marque", icon: Settings },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/courses", label: "Formations", icon: GraduationCap },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/media", label: "Médias", icon: Image },
];

export function AdminSidebar({ locale }: { locale: Locale }) {
  return (
    <nav className="sticky top-24 rounded-xl border bg-card p-4 shadow-sm">
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              locale={locale}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-brand-text transition-colors hover:bg-brand-soft hover:text-primary"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
