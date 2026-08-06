import type { Metadata } from "next";
import {
  Noto_Sans,
  Noto_Sans_Armenian,
  Noto_Serif,
  Noto_Serif_Armenian,
} from "next/font/google";
import Script from "next/script";
import { notFound } from "next/navigation";
import "../globals.css";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSiteSettings } from "@/lib/graphql/queries/siteSettings";
import { buildOrganizationSchema } from "@/lib/seo";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const OG_LOCALE: Record<Locale, string> = { hy: "hy_AM", ru: "ru_RU", en: "en_US" };

const notoSans = Noto_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoSansArmenian = Noto_Sans_Armenian({
  subsets: ["armenian"],
  variable: "--font-noto-armenian",
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin", "cyrillic"],
  variable: "--font-noto-serif",
  display: "swap",
});

const notoSerifArmenian = Noto_Serif_Armenian({
  subsets: ["armenian"],
  variable: "--font-noto-serif-armenian",
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : "hy";
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${dict.siteName} — ${dict.home.heroSubtitle}`,
      template: `%s | ${dict.siteName}`,
    },
    description: dict.home.aboutBlurb,
    keywords: dict.seo.keywords,
    robots: { index: true, follow: true },
    openGraph: {
      siteName: dict.siteName,
      locale: OG_LOCALE[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      images: [`${SITE_URL}/images/logo.jpg`],
      type: "website",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang as Locale);
  const siteSettings = await getSiteSettings(lang as Locale);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${notoSans.variable} ${notoSansArmenian.variable} ${notoSerif.variable} ${notoSerifArmenian.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          // Runs before first paint so the correct theme is applied with no
          // flash. Dark is the default for first-time visitors; a returning
          // visitor's explicit choice (stored by ThemeToggle) always wins.
          // A stable id lets Next.js dedupe this across client-side locale
          // navigations instead of re-inserting (and warning about) it.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('mesropants-theme');var d=s==='light'?false:true;if(d)document.documentElement.classList.add('dark');}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-cream text-charcoal dark:bg-dark-bg dark:text-dark-text">
        <JsonLd data={buildOrganizationSchema(siteSettings, lang as Locale, dict.siteName)} />
        <Header lang={lang as Locale} dict={dict} siteSettings={siteSettings} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang as Locale} dict={dict} siteSettings={siteSettings} />
      </body>
    </html>
  );
}
