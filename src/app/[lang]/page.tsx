import type { Metadata } from "next";
import Image from "next/image";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getHomeContent } from "@/lib/graphql/queries/home";
import { getAboutContent } from "@/lib/graphql/queries/about";
import { getCandles } from "@/lib/graphql/queries/candles";
import { buildAlternates } from "@/lib/seo";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import RevealText from "@/components/ui/RevealText";
import CandleGrid from "@/components/candles/CandleGrid";
import HeroSlider from "@/components/home/HeroSlider";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const homeContent = await getHomeContent(lang);
  return {
    title: homeContent.heroHeading,
    description: homeContent.heroDescription,
    alternates: buildAlternates("", lang),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const homeContent = await getHomeContent(lang as Locale);
  const aboutContent = await getAboutContent(lang as Locale);
  const candles = await getCandles(lang as Locale);
  const featuredCandles = candles.filter((candle) => candle.isFeatured);

  return (
    <>
      {/* Hero */}
      <HeroSlider
        slides={homeContent.heroImages.map((image) => ({
          src: image.url,
          alt: image.alt || dict.siteName,
        }))}
        eyebrow={homeContent.heroEyebrow}
        title={homeContent.heroHeading}
        subtitle={homeContent.heroDescription}
        ctaLabel={homeContent.heroButtonText}
        ctaHref={`/${lang}/candles`}
      />

      {/* About blurb */}
      <section className="py-20">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-full border border-gold/30 lg:order-1">
            {aboutContent.aboutImage ? (
              <Image
                src={aboutContent.aboutImage.url}
                alt={aboutContent.aboutImage.altText || dict.home.aboutHeading}
                fill
                sizes="(min-width: 1024px) 384px, 80vw"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-cream-dark dark:bg-dark-bg-soft" />
            )}
          </div>
          <div className="order-1 lg:order-2">
            <RevealText
              as="h2"
              text={dict.home.aboutHeading}
              className="font-display text-3xl font-semibold text-burgundy dark:text-dark-text sm:text-4xl"
            />
            <p className="mt-6 text-base leading-relaxed text-charcoal/80 dark:text-dark-text/80">
              {dict.home.aboutBlurb}
            </p>
            <div className="mt-8">
              <Button
                href={`/${lang}/about`}
                variant="outline"
                className="text-burgundy dark:text-dark-text"
              >
                {dict.common.readMore}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Candles preview */}
      <section className="bg-cream-dark/60 py-20 shadow-[inset_0_12px_20px_-18px_rgba(0,0,0,0.4)] dark:bg-dark-bg-soft/60 dark:shadow-[inset_0_12px_20px_-18px_rgba(0,0,0,0.6)]">
        <Container>
          <div className="text-center">
            <RevealText
              as="h2"
              text={homeContent.featuredHeading}
              className="font-display text-3xl font-semibold text-burgundy dark:text-dark-text sm:text-4xl"
            />
            <p className="mt-3 text-charcoal/70 dark:text-dark-text/70">
              {homeContent.featuredSubheading}
            </p>
          </div>

          <div className="mt-12">
            <CandleGrid
              candles={featuredCandles}
              lang={lang as Locale}
              viewDetailsLabel={dict.candles.viewDetails}
              priceOnRequestLabel={dict.common.priceOnRequest}
              currency={dict.common.currency}
              emptyLabel={dict.candles.emptyState}
            />
          </div>

          <div className="mt-14 text-center">
            <Button href={`/${lang}/candles`} variant="primary">
              {dict.common.viewAll}
            </Button>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-burgundy text-cream shadow-[inset_0_12px_20px_-18px_rgba(0,0,0,0.5)]">
        <Container className="flex flex-col items-center gap-6 py-16 text-center">
          <RevealText
            as="h2"
            text={homeContent.ctaHeading}
            className="font-display text-3xl font-semibold sm:text-4xl"
          />
          <p className="max-w-md text-cream/80">{homeContent.ctaText}</p>
          <Button href={`/${lang}/contact`} variant="secondary">
            {homeContent.ctaButtonText}
          </Button>
        </Container>
      </section>
    </>
  );
}
