import { fetchGraphQL, localeToLanguageCode, type WPLanguageCode } from "@/lib/graphql/client";
import type { Locale } from "@/lib/i18n/config";

export type HomeContent = {
  heroEyebrow: string;
  heroHeading: string;
  heroDescription: string;
  heroButtonText: string;
  heroImages: { url: string; alt: string }[];
  featuredHeading: string;
  featuredSubheading: string;
  ctaHeading: string;
  ctaText: string;
  ctaButtonText: string;
};

type RawImageEdge = { node: { sourceUrl: string; altText: string } } | null;

type RawHomeContent = {
  heroEyebrow: string;
  heroHeading: string;
  heroDescription: string;
  heroButtonText: string;
  featuredHeading: string;
  featuredSubheading: string;
  ctaHeading: string;
  ctaText: string;
  ctaButtonText: string;
  heroImage1: RawImageEdge;
  heroImage2: RawImageEdge;
  heroImage3: RawImageEdge;
};

type RawPageNode = {
  language: { code: WPLanguageCode };
  homeContent: RawHomeContent;
  translations: { language: { code: WPLanguageCode }; homeContent: RawHomeContent }[];
};

type GetHomeContentResponse = {
  pages: { nodes: RawPageNode[] };
};

// Anchored on the English slug ("home-2") -- page slugs are translated per
// locale and non-Latin slugs proved unreliable to query directly against
// this WPGraphQL install, so every locale's content is pulled in one request
// via the Polylang `translations` connection instead of a per-locale query.
const QUERY = /* GraphQL */ `
  query GetHomeContent {
    pages(where: { name: "home-2" }) {
      nodes {
        language {
          code
        }
        homeContent {
          ...HomeContentFields
        }
        translations {
          language {
            code
          }
          ... on Page {
            homeContent {
              ...HomeContentFields
            }
          }
        }
      }
    }
  }

  fragment HomeContentFields on HomeContent {
    heroEyebrow
    heroHeading
    heroDescription
    heroButtonText
    featuredHeading
    featuredSubheading
    ctaHeading
    ctaText
    ctaButtonText
    heroImage1 {
      node {
        sourceUrl
        altText
      }
    }
    heroImage2 {
      node {
        sourceUrl
        altText
      }
    }
    heroImage3 {
      node {
        sourceUrl
        altText
      }
    }
  }
`;

function toHomeContent(raw: RawHomeContent): HomeContent {
  const heroImages = [raw.heroImage1, raw.heroImage2, raw.heroImage3]
    .filter((edge): edge is NonNullable<RawImageEdge> => edge != null)
    .map((edge) => ({ url: edge.node.sourceUrl, alt: edge.node.altText }));

  return {
    heroEyebrow: raw.heroEyebrow,
    heroHeading: raw.heroHeading,
    heroDescription: raw.heroDescription,
    heroButtonText: raw.heroButtonText,
    heroImages,
    featuredHeading: raw.featuredHeading,
    featuredSubheading: raw.featuredSubheading,
    ctaHeading: raw.ctaHeading,
    ctaText: raw.ctaText,
    ctaButtonText: raw.ctaButtonText,
  };
}

export async function getHomeContent(lang: Locale): Promise<HomeContent> {
  const wanted = localeToLanguageCode(lang);
  const data = await fetchGraphQL<GetHomeContentResponse>(QUERY);
  const root = data.pages.nodes[0];

  if (root.language.code === wanted) {
    return toHomeContent(root.homeContent);
  }

  const translated = root.translations.find((t) => t.language.code === wanted);
  return toHomeContent(translated?.homeContent ?? root.homeContent);
}
