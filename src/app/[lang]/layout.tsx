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
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
  const { lang } = await params;
  const dict = await getDictionary(isLocale(lang) ? lang : "hy");
  return {
    title: `${dict.siteName} — ${dict.home.heroSubtitle}`,
    description: dict.home.aboutBlurb,
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
        <Header lang={lang as Locale} dict={dict} siteSettings={siteSettings} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang as Locale} dict={dict} siteSettings={siteSettings} />
      </body>
    </html>
  );
}
