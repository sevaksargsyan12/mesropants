import { fetchGraphQL, localeToLanguageCode, type WPLanguageCode } from "@/lib/graphql/client";
import type { Locale } from "@/lib/i18n/config";
import { sanitizeHtml } from "@/lib/sanitize";

export type AboutContent = {
  foundedYear: string;
  aboutText: string;
};

type RawPageNode = {
  language: { code: WPLanguageCode };
  aboutContent: AboutContent;
  translations: { language: { code: WPLanguageCode }; aboutContent: AboutContent }[];
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
          foundedYear
          aboutText
        }
        translations {
          language {
            code
          }
          ... on Page {
            aboutContent {
              foundedYear
              aboutText
            }
          }
        }
      }
    }
  }
`;

export async function getAboutContent(lang: Locale): Promise<AboutContent> {
  const wanted = localeToLanguageCode(lang);
  const data = await fetchGraphQL<GetAboutContentResponse>(QUERY);
  const root = data.pages.nodes[0];

  const content =
    root.language.code === wanted
      ? root.aboutContent
      : root.translations.find((t) => t.language.code === wanted)?.aboutContent ??
        root.aboutContent;

  return { ...content, aboutText: sanitizeHtml(content.aboutText) };
}
