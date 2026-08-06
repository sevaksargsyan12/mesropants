import {
  fetchGraphQL,
  languageCodeToLocale,
  localeToLanguageCode,
  type WPLanguageCode,
} from "@/lib/graphql/client";
import type { Locale } from "@/lib/i18n/config";
import type { Candle, CandleCategory } from "@/types/candle";
import { sanitizeHtml } from "@/lib/sanitize";

type RawCandleNode = {
  id: string;
  slug: string;
  title: string;
  language: { code: WPLanguageCode } | null;
  candleDetails: {
    isFeatured: boolean;
    price: number | null;
    showPrice: boolean;
    description: string | null;
  };
  candleCategories: { nodes: { slug: string }[] };
  featuredImage: { node: { sourceUrl: string; altText: string } } | null;
};

type GetCandlesResponse = {
  candles: { nodes: RawCandleNode[] };
};

type GetCandleBySlugResponse = {
  candle: RawCandleNode | null;
};

const CANDLE_FIELDS = /* GraphQL */ `
  id
  slug
  title
  language {
    code
  }
  candleDetails {
    isFeatured
    price
    showPrice
    description
  }
  candleCategories {
    nodes {
      slug
    }
  }
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
`;

const CANDLES_QUERY = /* GraphQL */ `
  query GetCandles($language: LanguageCodeFilterEnum!) {
    candles(where: { language: $language }, first: 100) {
      nodes {
        ${CANDLE_FIELDS}
      }
    }
  }
`;

const CANDLE_BY_SLUG_QUERY = /* GraphQL */ `
  query GetCandleBySlug($slug: ID!) {
    candle(id: $slug, idType: SLUG) {
      ${CANDLE_FIELDS}
    }
  }
`;

// Polylang gives the category taxonomy its own per-locale term, so the slug
// comes back as "church"/"decorative" for the default language but
// "church-en", "church-ru", etc. for translated candles -- match by prefix
// rather than exact value, or every non-default-locale candle silently
// disappears from both tabs.
function toCandleCategory(categorySlug: string | undefined): CandleCategory | null {
  if (!categorySlug) return null;
  if (categorySlug.startsWith("church")) return "church";
  if (categorySlug.startsWith("decorative")) return "decorative";
  return null;
}

// Candles without a recognized category are dropped rather than crashing --
// they'd otherwise have nowhere sensible to render (neither tab).
function toCandle(raw: RawCandleNode): Candle | null {
  const category = toCandleCategory(raw.candleCategories.nodes[0]?.slug);
  if (!category) return null;

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.title,
    category,
    featuredImage: raw.featuredImage
      ? { url: raw.featuredImage.node.sourceUrl, altText: raw.featuredImage.node.altText }
      : null,
    description: raw.candleDetails.description
      ? sanitizeHtml(raw.candleDetails.description)
      : null,
    price: raw.candleDetails.price,
    showPrice: raw.candleDetails.showPrice,
    isFeatured: raw.candleDetails.isFeatured,
  };
}

export async function getCandles(lang: Locale): Promise<Candle[]> {
  const data = await fetchGraphQL<GetCandlesResponse>(CANDLES_QUERY, {
    language: localeToLanguageCode(lang),
  });

  return data.candles.nodes
    .map(toCandle)
    .filter((candle): candle is Candle => candle !== null);
}

export async function getCandleBySlug(
  lang: Locale,
  slug: string
): Promise<Candle | null> {
  // WPGraphQL's singular `candle(idType: SLUG)` lookup has been observed to
  // both return null AND intermittently fail/time out for slugs that the
  // `candles` list connection resolves fine (confirmed directly against the
  // WP install, non-Latin slugs specifically) -- fall back to the
  // already-reliable list query on either outcome, rather than 404ing or
  // 500ing on a candle that genuinely exists.
  //
  // The lookup also has no language argument at all, so it matches a slug
  // against candles of ANY language -- with Polylang, only the default
  // locale keeps the bare slug (translations get a suffixed one, e.g.
  // "-ru"), so a wrong-language URL that happens to reuse the default
  // slug would otherwise silently render that other language's candle
  // instead of 404ing. Guard by checking the returned candle's own
  // language before accepting it.
  try {
    const data = await fetchGraphQL<GetCandleBySlugResponse>(CANDLE_BY_SLUG_QUERY, {
      slug,
    });
    if (data.candle && data.candle.language?.code === localeToLanguageCode(lang)) {
      return toCandle(data.candle);
    }
  } catch {
    // fall through to the list-based lookup below
  }

  const all = await getCandles(lang);
  return all.find((candle) => candle.slug === slug) ?? null;
}

type RawCandleTranslationsNode = {
  language: { code: WPLanguageCode } | null;
  translations: { language: { code: WPLanguageCode } | null; slug: string }[];
};

type GetCandleLocalizedSlugsResponse = {
  candle: RawCandleTranslationsNode | null;
};

const CANDLE_LOCALIZED_SLUGS_QUERY = /* GraphQL */ `
  query GetCandleLocalizedSlugs($slug: ID!) {
    candle(id: $slug, idType: SLUG) {
      language {
        code
      }
      translations {
        language {
          code
        }
        ... on Candle {
          slug
        }
      }
    }
  }
`;

// Polylang forces every translated candle to have a different slug from the
// original (WP won't allow two posts to share one, even across languages),
// so the language switcher can't just swap the `[lang]` segment of the
// current URL for candle detail pages -- it needs each locale's actual
// slug. Deliberately language-agnostic lookup: unlike `getCandleBySlug`,
// this is meant to resolve *other* locales' slugs for a candle we already
// know exists under the current one.
export async function getCandleLocalizedSlugs(
  slug: string
): Promise<Partial<Record<Locale, string>>> {
  const data = await fetchGraphQL<GetCandleLocalizedSlugsResponse>(
    CANDLE_LOCALIZED_SLUGS_QUERY,
    { slug }
  );
  if (!data.candle) return {};

  const map: Partial<Record<Locale, string>> = {};
  if (data.candle.language) {
    map[languageCodeToLocale(data.candle.language.code)] = slug;
  }
  for (const translation of data.candle.translations) {
    if (translation.language) {
      map[languageCodeToLocale(translation.language.code)] = translation.slug;
    }
  }
  return map;
}

export type CandlesPageContent = {
  candlesPageHeading: string;
  candlesPageSubheading: string;
};

type RawCandlesPageNode = {
  language: { code: WPLanguageCode };
  candlesPageContent: CandlesPageContent;
  translations: {
    language: { code: WPLanguageCode };
    candlesPageContent: CandlesPageContent;
  }[];
};

type GetCandlesPageContentResponse = {
  pages: { nodes: RawCandlesPageNode[] };
};

// Anchored on the English slug ("candles") -- see home.ts for why.
const CANDLES_PAGE_CONTENT_QUERY = /* GraphQL */ `
  query GetCandlesPageContent {
    pages(where: { name: "candles" }) {
      nodes {
        language {
          code
        }
        candlesPageContent {
          candlesPageHeading
          candlesPageSubheading
        }
        translations {
          language {
            code
          }
          ... on Page {
            candlesPageContent {
              candlesPageHeading
              candlesPageSubheading
            }
          }
        }
      }
    }
  }
`;

export async function getCandlesPageContent(lang: Locale): Promise<CandlesPageContent> {
  const wanted = localeToLanguageCode(lang);
  const data = await fetchGraphQL<GetCandlesPageContentResponse>(
    CANDLES_PAGE_CONTENT_QUERY
  );
  const root = data.pages.nodes[0];

  if (root.language.code === wanted) {
    return root.candlesPageContent;
  }

  const translated = root.translations.find((t) => t.language.code === wanted);
  return translated?.candlesPageContent ?? root.candlesPageContent;
}
