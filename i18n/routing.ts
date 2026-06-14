import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['fr', 'ar', 'en'] as const,
  defaultLocale: 'fr',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];

export const createSharedPathnamesNavigation = createNavigation;

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);
