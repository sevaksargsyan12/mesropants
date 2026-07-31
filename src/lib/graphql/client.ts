import "server-only";
import type { Locale } from "@/lib/i18n/config";

export type WPLanguageCode = "HY" | "RU" | "EN";

export function localeToLanguageCode(locale: Locale): WPLanguageCode {
  const map: Record<Locale, WPLanguageCode> = { hy: "HY", ru: "RU", en: "EN" };
  return map[locale];
}

export function languageCodeToLocale(code: WPLanguageCode): Locale {
  const map: Record<WPLanguageCode, Locale> = { HY: "hy", RU: "ru", EN: "en" };
  return map[code];
}

const GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL;

async function requestOnce<T>(
  query: string,
  variables: Record<string, unknown> | undefined
): Promise<T> {
  const res = await fetch(GRAPHQL_URL as string, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`WPGraphQL request failed with status ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(
      `WPGraphQL query returned errors: ${json.errors
        .map((e: { message: string }) => e.message)
        .join("; ")}`
    );
  }

  return json.data as T;
}

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  if (!GRAPHQL_URL) {
    throw new Error(
      "NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL is not set (check .env.local)"
    );
  }

  try {
    return await requestOnce<T>(query, variables);
  } catch (err) {
    // The local WP/Apache dev install occasionally drops a connection under
    // load (observed as ECONNRESET-style socket errors, unrelated to query
    // correctness) -- one retry papers over that without masking real
    // GraphQL/validation errors, which still throw immediately on the retry.
    if (err instanceof TypeError) {
      return await requestOnce<T>(query, variables);
    }
    throw err;
  }
}
