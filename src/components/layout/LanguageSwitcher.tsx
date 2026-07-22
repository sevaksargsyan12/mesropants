"use client";

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

export default function LanguageSwitcher({
  currentLocale,
  className = "",
}: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    <div className={`flex items-center gap-1 text-xs font-semibold tracking-wide ${className}`}>
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          <Link
            href={localizedPath(pathname, locale)}
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
