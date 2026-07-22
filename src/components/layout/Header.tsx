"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import LanguageSwitcher from "./LanguageSwitcher";
import SocialLinks from "./SocialLinks";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  lang: Locale;
  dict: Dictionary;
};

export default function Header({ lang, dict }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/candles`, label: dict.nav.candles },
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  const isActive = (href: string) =>
    href === `/${lang}` ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-burgundy/10 bg-cream/95 backdrop-blur dark:border-dark-text/10 dark:bg-dark-bg/95">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <Link href={`/${lang}`} className="flex items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt={dict.siteName}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover motion-safe:animate-logo-spin"
            priority
          />
          <span className="font-display text-lg font-semibold tracking-wide text-burgundy dark:text-dark-text">
            {dict.siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-semibold tracking-wide uppercase transition-colors duration-200 ${
                isActive(item.href)
                  ? "text-gold-dark dark:text-dark-text"
                  : "text-burgundy hover:text-gold-dark dark:text-dark-text/70 dark:hover:text-dark-text"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <SocialLinks labels={dict.social} className="text-burgundy dark:text-dark-text" />
          <LanguageSwitcher currentLocale={lang} className="text-burgundy dark:text-dark-text" />
          <ThemeToggle className="text-burgundy dark:text-dark-text" />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle className="text-burgundy dark:text-dark-text" />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full text-burgundy dark:text-dark-text"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-burgundy/10 bg-cream px-6 pb-6 dark:border-dark-text/10 dark:bg-dark-bg md:hidden">
          <nav className="flex flex-col gap-4 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`text-sm font-semibold tracking-wide uppercase ${
                  isActive(item.href)
                    ? "text-gold-dark dark:text-dark-text"
                    : "text-burgundy dark:text-dark-text/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex items-center justify-between">
            <SocialLinks labels={dict.social} className="text-burgundy dark:text-dark-text" />
            <LanguageSwitcher currentLocale={lang} className="text-burgundy dark:text-dark-text" />
          </div>
        </div>
      )}
    </header>
  );
}
