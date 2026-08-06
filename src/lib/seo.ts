import { locales, type Locale } from "@/lib/i18n/config";
import type { SiteSettings } from "@/lib/graphql/queries/siteSettings";
import type { Candle } from "@/types/candle";
import { htmlToText } from "@/lib/sanitize";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// hreflang/canonical for the fixed Next.js routes (About/Contact/Candles
// listing/church/decorative/Home) -- these are identical paths across
// locales (only the `[lang]` segment differs), unlike the candle detail
// page, whose per-locale slugs come from getCandleLocalizedSlugs instead.
export function buildAlternates(pathSuffix: string, currentLang: Locale) {
  const languages = Object.fromEntries(
    locales.map((l) => [l, `${SITE_URL}/${l}${pathSuffix}`])
  );
  return {
    canonical: `${SITE_URL}/${currentLang}${pathSuffix}`,
    languages: { ...languages, "x-default": `${SITE_URL}/hy${pathSuffix}` },
  };
}

// schema.org LocalBusiness -- site-wide, rendered once from the root layout.
// Structured data has no locale-alternates concept of its own, so this is
// just the same business info re-described in whichever language the
// current page is in.
export function buildOrganizationSchema(
  siteSettings: SiteSettings,
  lang: Locale,
  siteName: string
) {
  const sameAs = [
    siteSettings.instagramLink,
    siteSettings.facebookLink,
    siteSettings.whatsappLink,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteName,
    url: `${SITE_URL}/${lang}`,
    image: `${SITE_URL}/images/logo.jpg`,
    logo: `${SITE_URL}/images/logo.jpg`,
    telephone: siteSettings.phoneDisplayNumber || siteSettings.phoneNumber || undefined,
    email: siteSettings.notificationEmail || undefined,
    address: siteSettings.address
      ? { "@type": "PostalAddress", streetAddress: siteSettings.address }
      : undefined,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

// hreflang/canonical for a candle detail page -- unlike the fixed routes
// above, each locale has its own slug (see getCandleLocalizedSlugs), so
// only locales with a confirmed translation get an alternate link; a
// locale with no translation yet is simply omitted rather than pointing at
// a slug that doesn't exist there.
export function buildCandleAlternates(
  localizedSlugs: Partial<Record<Locale, string>>,
  currentLang: Locale
) {
  const languages = Object.fromEntries(
    Object.entries(localizedSlugs).map(([l, slug]) => [l, `${SITE_URL}/${l}/candles/${slug}`])
  );
  const currentSlug = localizedSlugs[currentLang];
  return {
    canonical: currentSlug ? `${SITE_URL}/${currentLang}/candles/${currentSlug}` : undefined,
    languages,
  };
}

// schema.org Product -- rendered on each candle detail page. `offers` is
// only included when the candle actually shows a price (some candles are
// "price on request"), matching how the page itself renders price.
export function buildProductSchema(candle: Candle, lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: candle.name,
    description: candle.description ? htmlToText(candle.description) : undefined,
    image: candle.featuredImage?.url,
    url: `${SITE_URL}/${lang}/candles/${candle.slug}`,
    category: candle.category === "church" ? "Church candles" : "Decorative candles",
    ...(candle.showPrice && candle.price != null
      ? {
          offers: {
            "@type": "Offer",
            price: candle.price,
            priceCurrency: "AMD",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/${lang}/candles/${candle.slug}`,
          },
        }
      : {}),
  };
}
