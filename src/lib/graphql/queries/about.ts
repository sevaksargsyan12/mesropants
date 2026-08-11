import { fetchGraphQL, localeToLanguageCode, type WPLanguageCode } from "@/lib/graphql/client";
import type { Locale } from "@/lib/i18n/config";
import { sanitizeHtml } from "@/lib/sanitize";

export type AboutContent = {
  aboutHeading: string;
  foundedYear: string;
  aboutText: string;
  aboutImage: { url: string; altText: string } | null;
  missionHeading: string;
  missionText: string;
};

type RawImageEdge = { node: { sourceUrl: string; altText: string } } | null;

type RawAboutContent = {
  aboutHeading: string;
  foundedYear: string;
  aboutText: string;
  aboutImage: RawImageEdge;
  missionHeading: string;
  missionText: string;
};

type RawPageNode = {
  language: { code: WPLanguageCode };
  aboutContent: RawAboutContent;
  translations: { language: { code: WPLanguageCode }; aboutContent: RawAboutContent }[];
};

type GetAboutContentResponse = {
  pages: { nodes: RawPageNode[] };
};

// Anchored on the English slug ("about-us") -- see home.ts for why.
const QUERY = /* GraphQL */ `
  query GetAboutContent {
    pages(where: { name: "about-us" }) {
      nodes {
        language {
          code
        }
        aboutContent {
          ...AboutContentFields
        }
        translations {
          language {
            code
          }
          ... on Page {
            aboutContent {
              ...AboutContentFields
            }
          }
        }
      }
    }
  }

  fragment AboutContentFields on AboutContent {
    aboutHeading
    foundedYear
    aboutText
    missionHeading
    missionText
    aboutImage {
      node {
        sourceUrl
        altText
      }
    }
  }
`;

function toAboutContent(raw: RawAboutContent): AboutContent {
  return {
    aboutHeading: raw.aboutHeading,
    foundedYear: raw.foundedYear,
    aboutText: sanitizeHtml(raw.aboutText),
    aboutImage: raw.aboutImage
      ? { url: raw.aboutImage.node.sourceUrl, altText: raw.aboutImage.node.altText }
      : null,
    missionHeading: raw.missionHeading,
    missionText: raw.missionText,
  };
}

export async function getAboutContent(lang: Locale): Promise<AboutContent> {
  const wanted = localeToLanguageCode(lang);
  const data = await fetchGraphQL<GetAboutContentResponse>(QUERY);
  const root = data.pages.nodes[0];

  const raw =
    root.language.code === wanted
      ? root.aboutContent
      : root.translations.find((t) => t.language.code === wanted)?.aboutContent ??
        root.aboutContent;

  return toAboutContent(raw);
}
