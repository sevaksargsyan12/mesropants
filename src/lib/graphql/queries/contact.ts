import { fetchGraphQL, localeToLanguageCode, type WPLanguageCode } from "@/lib/graphql/client";
import type { Locale } from "@/lib/i18n/config";
import type { SiteSettings } from "./siteSettings";

export type ContactPageData = {
  contactHeading: string;
  contactSubheading: string;
  siteSettings: SiteSettings;
};

type RawContactContent = {
  contactHeading: string;
  contactSubheading: string;
};

type RawPageNode = {
  language: { code: WPLanguageCode };
  contactContent: RawContactContent;
  translations: { language: { code: WPLanguageCode }; contactContent: RawContactContent }[];
};

type RawSiteSettingsNode = {
  language: { code: WPLanguageCode };
  siteSettings: SiteSettings;
  translations: { language: { code: WPLanguageCode }; siteSettings: SiteSettings }[];
};

type GetContactPageDataResponse = {
  contactPages: { nodes: RawPageNode[] };
  siteSettingsPages: { nodes: RawSiteSettingsNode[] };
};

// Anchored on the English slugs ("contact" / "site-settings") -- see home.ts
// for why. Two page lookups in one request via GraphQL query aliasing.
const QUERY = /* GraphQL */ `
  query GetContactPageData {
    contactPages: pages(where: { name: "contact" }) {
      nodes {
        language {
          code
        }
        contactContent {
          contactHeading
          contactSubheading
        }
        translations {
          language {
            code
          }
          ... on Page {
            contactContent {
              contactHeading
              contactSubheading
            }
          }
        }
      }
    }
    siteSettingsPages: pages(where: { name: "site-settings" }) {
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

export async function getContactPageData(lang: Locale): Promise<ContactPageData> {
  const wanted = localeToLanguageCode(lang);
  const data = await fetchGraphQL<GetContactPageDataResponse>(QUERY);

  const contactRoot = data.contactPages.nodes[0];
  const contactContent =
    contactRoot.language.code === wanted
      ? contactRoot.contactContent
      : contactRoot.translations.find((t) => t.language.code === wanted)?.contactContent ??
        contactRoot.contactContent;

  const settingsRoot = data.siteSettingsPages.nodes[0];
  const siteSettings =
    settingsRoot.language.code === wanted
      ? settingsRoot.siteSettings
      : settingsRoot.translations.find((t) => t.language.code === wanted)?.siteSettings ??
        settingsRoot.siteSettings;

  return {
    contactHeading: contactContent.contactHeading,
    contactSubheading: contactContent.contactSubheading,
    siteSettings,
  };
}
