import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import { siteSettings } from "@/lib/mock/siteSettings";
import SocialLinks from "./SocialLinks";
import Container from "../ui/Container";

type FooterProps = {
  lang: Locale;
  dict: Dictionary;
};

export default function Footer({ lang, dict }: FooterProps) {
  const year = new Date().getFullYear();

  const navItems = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/candles`, label: dict.nav.candles },
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="bg-burgundy-dark text-cream shadow-[inset_0_12px_20px_-18px_rgba(0,0,0,0.5)]">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href={`/${lang}`} className="flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt={dict.siteName}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
            />
            <span className="font-display text-lg font-semibold tracking-wide">
              {dict.siteName}
            </span>
          </Link>
          <p className="mt-4 text-sm text-cream/70">{dict.footer.tagline}</p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-gold">
            {dict.footer.quickLinks}
          </h3>
          <ul className="mt-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-cream/80 transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-gold">
            {dict.nav.contact}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-cream/80">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" />
              <a href={siteSettings.phoneHref} className="hover:text-gold">
                {siteSettings.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" />
              <span>{siteSettings.address}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-gold">
            {dict.footer.followUs}
          </h3>
          <SocialLinks labels={dict.social} className="mt-4 text-cream" />
        </div>
      </Container>

      <div className="border-t border-cream/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-cream/60 sm:flex-row">
          <span>
            © {year} {dict.siteName}. {dict.footer.rights}.
          </span>
        </Container>
      </div>
    </footer>
  );
}
