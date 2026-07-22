import Image from "next/image";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getAllCandles } from "@/lib/mock/candles";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import RevealText from "@/components/ui/RevealText";
import CandleGrid from "@/components/candles/CandleGrid";
import HeroSlider from "@/components/home/HeroSlider";

const heroSlides = [
  { src: "/images/hero_slider/hero.webp" },
  { src: "/images/hero_slider/hero2.webp" },
  { src: "/images/hero_slider/hero3.webp" },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const featuredCandles = getAllCandles().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <HeroSlider
        slides={heroSlides.map((slide) => ({ ...slide, alt: dict.siteName }))}
        eyebrow={dict.home.heroEyebrow}
        title={dict.home.heroTitle}
        subtitle={dict.home.heroSubtitle}
        ctaLabel={dict.home.heroCta}
        ctaHref={`/${lang}/candles`}
      />

      {/* About blurb */}
      <section className="py-20">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-full border border-gold/30 lg:order-1">
            <Image
              src="/images/candles/decorative/43531f43-ff08-462b-b2cb-a24d1263b7f7.png"
              alt={dict.home.aboutHeading}
              fill
              sizes="(min-width: 1024px) 384px, 80vw"
              className="object-cover"
            />
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
              text={dict.home.candlesPreviewHeading}
              className="font-display text-3xl font-semibold text-burgundy dark:text-dark-text sm:text-4xl"
            />
            <p className="mt-3 text-charcoal/70 dark:text-dark-text/70">
              {dict.home.candlesPreviewSubheading}
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
            text={dict.home.ctaHeading}
            className="font-display text-3xl font-semibold sm:text-4xl"
          />
          <p className="max-w-md text-cream/80">{dict.home.ctaSubheading}</p>
          <Button href={`/${lang}/contact`} variant="secondary">
            {dict.home.ctaButton}
          </Button>
        </Container>
      </section>
    </>
  );
}
