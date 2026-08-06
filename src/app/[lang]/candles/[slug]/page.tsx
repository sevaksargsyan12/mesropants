import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getCandleBySlug, getCandleLocalizedSlugs } from "@/lib/graphql/queries/candles";
import { buildCandleAlternates, buildProductSchema } from "@/lib/seo";
import { htmlToText } from "@/lib/sanitize";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import JsonLd from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const decodedSlug = decodeURIComponent(slug);
  const candle = await getCandleBySlug(lang, decodedSlug);
  if (!candle) return {};

  const localizedSlugs = await getCandleLocalizedSlugs(decodedSlug);
  return {
    title: candle.name,
    description: candle.description ? htmlToText(candle.description).slice(0, 160) : undefined,
    alternates: buildCandleAlternates(localizedSlugs, lang),
  };
}

export default async function CandleDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  // Non-ASCII dynamic segments arrive still percent-encoded (e.g.
  // "bubble-%D5%AF..." instead of "bubble-կուբիկաձև...") rather than
  // pre-decoded, so decode explicitly before using it as a lookup key.
  const candle = await getCandleBySlug(lang as Locale, decodeURIComponent(slug));
  if (!candle) notFound();

  const categoryLabel =
    candle.category === "church"
      ? dict.candleDetail.categoryChurch
      : dict.candleDetail.categoryDecorative;

  return (
    <section className="py-16 sm:py-20">
      <JsonLd data={buildProductSchema(candle, lang as Locale)} />
      <Container>
        <Link
          href={`/${lang}/candles`}
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-burgundy transition-colors hover:text-gold-dark dark:text-dark-text"
        >
          <ArrowLeft className="h-4 w-4" />
          {dict.candleDetail.backLink}
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-t-[6rem] rounded-b-2xl border border-gold/30 motion-safe:animate-shadow-orbit">
            {candle.featuredImage ? (
              <Image
                src={candle.featuredImage.url}
                alt={candle.featuredImage.altText}
                fill
                sizes="(min-width: 1024px) 448px, 90vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full bg-cream-dark dark:bg-dark-bg-soft" />
            )}
          </div>

          <div>
            <span className="inline-block rounded-full bg-gold/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold-dark">
              {categoryLabel}
            </span>

            <h1 className="mt-4 font-display text-3xl font-semibold text-burgundy dark:text-dark-text sm:text-4xl">
              {candle.name}
            </h1>

            {candle.showPrice && candle.price != null ? (
              <p className="mt-4 text-2xl font-semibold text-gold-dark">
                {candle.price.toLocaleString()} {dict.common.currency}
              </p>
            ) : (
              <p className="mt-4 text-sm uppercase tracking-wide text-gold-dark">
                {dict.common.priceOnRequest}
              </p>
            )}

            {candle.description && (
              <div className="mt-8">
                <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-burgundy/70 dark:text-dark-text/70">
                  {dict.candleDetail.descriptionHeading}
                </h2>
                <div
                  className="mt-3 leading-relaxed text-charcoal/80 [&_p]:mb-3 last:[&_p]:mb-0 dark:text-dark-text/80"
                  dangerouslySetInnerHTML={{ __html: candle.description }}
                />
              </div>
            )}

            <div className="mt-10">
              <Button href={`/${lang}/contact`} variant="primary">
                {dict.candleDetail.inquireButton}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
