import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getCandles } from "@/lib/graphql/queries/candles";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Fixed Next.js routes -- identical path across locales, only the `[lang]`
// prefix differs (candle detail pages are handled separately below since
// each locale has its own slug).
const FIXED_PATHS: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/candles", priority: 0.9 },
  { path: "/candles/church", priority: 0.7 },
  { path: "/candles/decorative", priority: 0.7 },
  { path: "/about", priority: 0.6 },
  { path: "/contact", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const fixedEntries: MetadataRoute.Sitemap = locales.flatMap((lang) =>
    FIXED_PATHS.map(({ path, priority }) => ({
      url: `${SITE_URL}/${lang}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
    }))
  );

  const candlesByLocale = await Promise.all(locales.map((lang) => getCandles(lang)));
  const candleEntries: MetadataRoute.Sitemap = locales.flatMap((lang, i) =>
    candlesByLocale[i].map((candle) => ({
      url: `${SITE_URL}/${lang}/candles/${candle.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
  );

  return [...fixedEntries, ...candleEntries];
}
