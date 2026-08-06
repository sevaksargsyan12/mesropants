import Image from "next/image";
import Link from "next/link";
import type { Candle } from "@/types/candle";
import type { Locale } from "@/lib/i18n/config";
import { htmlToText } from "@/lib/sanitize";

type CandleCardProps = {
  candle: Candle;
  lang: Locale;
  index?: number;
  centered?: boolean;
  viewDetailsLabel: string;
  priceOnRequestLabel: string;
  currency: string;
};

export default function CandleCard({
  candle,
  lang,
  index = 0,
  centered = false,
  viewDetailsLabel,
  priceOnRequestLabel,
  currency,
}: CandleCardProps) {
  return (
    <Link
      href={`/${lang}/candles/${candle.slug}`}
      className={`group relative block aspect-[3/4] overflow-hidden rounded-t-[clamp(3rem,12vw,6rem)] rounded-b-2xl border border-gold/25 transition-all duration-500 hover:border-gold hover:shadow-[0_0_40px_-8px_rgba(212,162,76,0.6)] ${
        centered ? "lg:col-start-2" : ""
      }`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-1.5 -z-10 rounded-[inherit] blur-md motion-safe:animate-shadow-orbit"
        style={{ animationDelay: `${(index % 3) * 1.3}s` }}
      />

      {candle.featuredImage ? (
        <Image
          src={candle.featuredImage.url}
          alt={candle.featuredImage.altText}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      ) : (
        <div className="h-full w-full bg-cream-dark" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark via-burgundy-dark/25 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <h3 className="font-display text-base font-semibold uppercase tracking-wide text-cream sm:text-lg">
          {candle.name}
        </h3>

        {candle.description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-cream/75">
            {htmlToText(candle.description)}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          {candle.showPrice && candle.price != null ? (
            <span className="text-sm font-semibold text-gold">
              {candle.price.toLocaleString()} {currency}
            </span>
          ) : (
            <span className="text-xs uppercase tracking-wide text-gold/70">
              {priceOnRequestLabel}
            </span>
          )}
          <span className="text-xs uppercase tracking-widest text-cream/70 transition-colors duration-300 group-hover:text-gold">
            {viewDetailsLabel} →
          </span>
        </div>
      </div>
    </Link>
  );
}
