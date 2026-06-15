import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import type { Localized } from "@/lib/cms/types";

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

export async function Footer({ brandName }: { brandName: Localized<string> }) {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-brand-soft py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-heading text-lg font-bold text-primary">
              {brandName.fr}
            </h3>
            <p className="mt-2 text-sm text-brand-text">{t("brand.agency")}</p>
            <p className="mt-4 text-sm text-brand-text">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary">
              {t("footer.links")}
            </h4>
            <ul className="mt-4 space-y-2">
              {navKeys.map((key) => (
                <li key={key}>
                  <Link
                    href={navHref(key)}
                    className="text-sm text-brand-text hover:text-primary"
                  >
                    {t(`navigation.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary">
              {t("footer.legal")}
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-sm text-brand-text hover:text-primary"
                >
                  {t("footer.legal")}
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="text-sm text-brand-text hover:text-primary"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-brand-text">
          {t("footer.copyright", { year })}
        </div>
      </div>
    </footer>
  );
}
