import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { PageTracker } from "@/components/page-tracker";
import { SchemaOrg } from "@/components/schema-org";
import { getSiteSettings } from "@/lib/cms/settings";
import { buildOrganizationSchema, buildLocalBusinessSchema, buildWebsiteSchema } from "@/lib/schema-org";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://businessalgerie.com";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSiteSettings();

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `/${l}`;
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      template: settings.seo_default.titleTemplate,
      default: settings.brand_name.fr,
    },
    description: settings.seo_default.description,
    keywords: settings.seo_default.keywords,
    icons: settings.favicon_url ? { icon: settings.favicon_url } : undefined,
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);
  const messages = await getMessages();
  const dir = typedLocale === "ar" ? "rtl" : "ltr";
  const settings = await getSiteSettings();

  return (
    <html
      lang={typedLocale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {settings.analytics.searchConsoleHtmlTag && (
          <meta name="google-site-verification" content={settings.analytics.searchConsoleHtmlTag} />
        )}
        <SchemaOrg
          data={[
            buildOrganizationSchema(settings),
            buildLocalBusinessSchema(settings),
            buildWebsiteSchema(settings),
          ]}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages} locale={typedLocale}>
          <AnalyticsProvider settings={settings} />
          <PageTracker locale={typedLocale} />
          <Header
            locale={typedLocale}
            dir={dir}
            brandName={settings.brand_name}
            logoUrl={settings.logo_url}
            logoWidth={settings.logo_width}
            logoHeight={settings.logo_height}
          />
          <main className="flex-1">{children}</main>
          <Footer brandName={settings.brand_name} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
