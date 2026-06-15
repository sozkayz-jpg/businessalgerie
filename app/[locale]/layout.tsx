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
import { getSiteSettings } from "@/lib/cms/settings";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      template: settings.seo_default.titleTemplate,
      default: settings.brand_name.fr,
    },
    description: settings.seo_default.description,
    keywords: settings.seo_default.keywords,
    icons: settings.favicon_url ? { icon: settings.favicon_url } : undefined,
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
          />
          <main className="flex-1">{children}</main>
          <Footer brandName={settings.brand_name} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
