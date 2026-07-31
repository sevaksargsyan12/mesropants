import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getHomeContent } from "@/lib/graphql/queries/home";
import { getCandles } from "@/lib/graphql/queries/candles";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import RevealText from "@/components/ui/RevealText";
import CandleGrid from "@/components/candles/CandleGrid";
import HeroSlider from "@/components/home/HeroSlider";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const homeContent = await getHomeContent(lang as Locale);
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
        title={homeContent.heroHeading}
        subtitle={homeContent.heroDescription}
        ctaLabel={homeContent.heroButtonText}
        ctaHref={`/${lang}/candles`}
      />

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
