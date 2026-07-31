"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeLabels, type Locale } from "@/lib/i18n/config";

type LanguageSwitcherProps = {
  currentLocale: Locale;
  className?: string;
};

function localizedPath(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  segments[1] = target;
  return segments.join("/") || `/${target}`;
}

// Every other route is a fixed Next.js path (never sourced from WP), so a
// plain `[lang]`-segment swap is correct for it. Candle detail pages are the
// one exception -- Polylang gives each locale's candle its own slug -- so
// they need to be detected and resolved separately.
function candleSlugFromPath(pathname: string): string | null {
  const segments = pathname.split("/");
  if (segments.length !== 4 || segments[2] !== "candles") return null;
  if (segments[3] === "church" || segments[3] === "decorative") return null;
  return segments[3];
}

export default function LanguageSwitcher({
  currentLocale,
  className = "",
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const candleSlug = candleSlugFromPath(pathname);
  const [localizedSlugs, setLocalizedSlugs] = useState<Partial<Record<Locale, string>>>({});
  // Tracks which slug `localizedSlugs` is the confirmed answer for, so a
  // stale in-flight/previous result is never applied to the wrong candle.
  const [resolvedForSlug, setResolvedForSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!candleSlug) return;

    let cancelled = false;
    fetch(`/api/candle-locales?slug=${encodeURIComponent(candleSlug)}`)
      .then((res) => (res.ok ? res.json() : {}))
      .then((slugs: Partial<Record<Locale, string>>) => {
        if (!cancelled) {
          setLocalizedSlugs(slugs);
          setResolvedForSlug(candleSlug);
        }
      })
      .catch(() => {
        if (!cancelled) setResolvedForSlug(candleSlug);
      });

    return () => {
      cancelled = true;
    };
  }, [candleSlug]);

  function hrefFor(target: Locale): string {
    if (!candleSlug) return localizedPath(pathname, target);

    const resolvedSlug = localizedSlugs[target];
    if (resolvedSlug) {
      const segments = pathname.split("/");
      segments[1] = target;
      segments[3] = resolvedSlug;
      return segments.join("/");
    }
    // Polylang has no translation for this candle in the target language --
    // don't guess at a slug that likely doesn't exist there, send the
    // visitor to that language's candles listing instead.
    if (resolvedForSlug === candleSlug) return `/${target}/candles`;
    // Still resolving: keep the naive same-slug link as a harmless
    // placeholder until the real answer (translated slug or listing
    // fallback) arrives.
    return localizedPath(pathname, target);
  }

  return (
    <div className={`flex items-center gap-1 text-xs font-semibold tracking-wide ${className}`}>
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          <Link
            href={hrefFor(locale)}
            aria-current={locale === currentLocale ? "true" : undefined}
            className={
              locale === currentLocale
                ? "text-gold"
                : "text-current/60 hover:text-current"
            }
          >
            {localeLabels[locale]}
          </Link>
          {index < locales.length - 1 && (
            <span className="text-current/30">/</span>
          )}
        </span>
      ))}
    </div>
  );
}
