"use client";

import { useEffect, useState } from "react";
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

  // Lock background scroll while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const navItems = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/candles`, label: dict.nav.candles },
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  const isActive = (href: string) =>
    href === `/${lang}` ? pathname === href : pathname.startsWith(href);

  return (
    <>
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
              onClick={() => setOpen(true)}
              aria-label="Menu"
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full text-burgundy dark:text-dark-text"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-charcoal/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Slide-in drawer */}
      <div
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col overflow-y-auto bg-cream/80 shadow-2xl backdrop-blur-md transition-transform duration-150 ease-in-out dark:bg-dark-bg/80 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-burgundy/10 px-6 py-4 dark:border-dark-text/10">
          <Link
            href={`/${lang}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <Image
              src="/images/logo.jpg"
              alt={dict.siteName}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="font-display text-base font-semibold tracking-wide text-burgundy dark:text-dark-text">
              {dict.siteName}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle className="text-burgundy dark:text-dark-text" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-burgundy dark:text-dark-text"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-4 py-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onClick={() => setOpen(false)}
              className={`rounded-xl px-3 py-3 text-base font-semibold uppercase tracking-wide transition-colors duration-200 ${
                isActive(item.href)
                  ? "bg-gold/10 text-gold-dark dark:text-dark-text"
                  : "text-burgundy hover:bg-burgundy/5 dark:text-dark-text/80 dark:hover:bg-dark-text/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex items-center justify-between border-t border-burgundy/10 px-6 py-6 dark:border-dark-text/10">
          <SocialLinks labels={dict.social} className="text-burgundy dark:text-dark-text" />
          <LanguageSwitcher currentLocale={lang} className="text-burgundy dark:text-dark-text" />
        </div>
      </div>
    </>
  );
}
