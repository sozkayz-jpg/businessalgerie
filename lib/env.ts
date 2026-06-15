export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://businessalgerie.com";

// URL de l'application dynamique (admin, membre, checkout). Par défaut,
// elle est identique au site public (cas Vercel full-app). Pour l'architecture
// hybride o2switch + Vercel, cette variable pointe vers le sous-domaine admin.
export const ADMIN_URL =
  process.env.NEXT_PUBLIC_ADMIN_URL || SITE_URL;

export function buildPublicUrl(locale: string, path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}/${locale}${cleanPath}`;
}

export function buildAdminUrl(locale: string, path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${ADMIN_URL}/${locale}${cleanPath}`;
}
