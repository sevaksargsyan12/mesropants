import { fetchGraphQL, localeToLanguageCode, type WPLanguageCode } from "@/lib/graphql/client";
import type { Locale } from "@/lib/i18n/config";

export type SiteSettings = {
  phoneNumber: string;
  phoneDisplayNumber: string;
  address: string;
  notificationEmail: string;
  instagramLink: string;
  facebookLink: string;
  whatsappLink: string;
};

type RawPageNode = {
  language: { code: WPLanguageCode };
  siteSettings: SiteSettings;
  translations: { language: { code: WPLanguageCode }; siteSettings: SiteSettings }[];
};

type GetSiteSettingsResponse = {
  pages: { nodes: RawPageNode[] };
};

// Anchored on the English slug ("site-settings") -- see home.ts for why.
const QUERY = /* GraphQL */ `
  query GetSiteSettings {
    pages(where: { name: "site-settings" }) {
      nodes {
        language {
          code
        }
        siteSettings {
          phoneNumber
          phoneDisplayNumber
          address
          notificationEmail
          instagramLink
          facebookLink
          whatsappLink
        }
        translations {
          language {
            code
          }
          ... on Page {
            siteSettings {
              phoneNumber
              phoneDisplayNumber
              address
              notificationEmail
              instagramLink
              facebookLink
              whatsappLink
            }
          }
        }
      }
    }
  }
`;

export async function getSiteSettings(lang: Locale): Promise<SiteSettings> {
  const wanted = localeToLanguageCode(lang);
  const data = await fetchGraphQL<GetSiteSettingsResponse>(QUERY);
  const root = data.pages.nodes[0];

  if (root.language.code === wanted) {
    return root.siteSettings;
  }

  const translated = root.translations.find((t) => t.language.code === wanted);
  return translated?.siteSettings ?? root.siteSettings;
}
