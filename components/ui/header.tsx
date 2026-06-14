"use client";

import * as React from "react";
import { Menu, Globe, ChevronDown } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Link,
  usePathname,
  useRouter,
  routing,
  type Locale,
} from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const navKeys = [
  "home",
  "courses",
  "agency",
  "services",
  "about",
  "blog",
  "contact",
] as const;

function navHref(key: (typeof navKeys)[number]) {
  if (key === "home") return "/";
  if (key === "courses") return "/formations";
  if (key === "agency") return "/agence";
  if (key === "about") return "/a-propos";
  return `/${key}`;
}

export function Header({
  locale,
  dir,
}: {
  locale: Locale;
  dir: "ltr" | "rtl";
}) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const switchLocale = (nextLocale: Locale) => {
    router.replace(pathname, { locale: nextLocale });
  };

  const sheetSide = dir === "rtl" ? "left" : "right";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-lg font-bold text-primary"
        >
          <span>{t("brand.name")}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={navHref(key)}
              className="text-sm font-medium text-brand-text transition-colors hover:text-primary"
            >
              {t(`navigation.${key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-brand-text outline-none hover:bg-muted">
              <Globe className="size-4" />
              <span>{t(`locales.${locale}`)}</span>
              <ChevronDown className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {routing.locales.map((l) => (
                <DropdownMenuItem
                  key={l}
                  onClick={() => switchLocale(l)}
                  className="cursor-pointer"
                >
                  {t(`locales.${l}`)}
                  {l === locale && (
                    <span className="ms-auto text-accent">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/member"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden md:inline-flex"
            )}
          >
            {t("navigation.member")}
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-5" />
                  <span className="sr-only">{t("navigation.home")}</span>
                </Button>
              }
            />
            <SheetContent side={sheetSide} className="w-3/4 sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>{t("brand.name")}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                {navKeys.map((key) => (
                  <Link
                    key={key}
                    href={navHref(key)}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-brand-text transition-colors hover:bg-muted hover:text-primary"
                  >
                    {t(`navigation.${key}`)}
                  </Link>
                ))}
                <Link
                  href="/member"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-brand-text transition-colors hover:bg-muted hover:text-primary"
                >
                  {t("navigation.member")}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
