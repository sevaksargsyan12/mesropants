import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getCandles } from "@/lib/graphql/queries/candles";
import { buildAlternates } from "@/lib/seo";
import Container from "@/components/ui/Container";
import CandleGrid from "@/components/candles/CandleGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);
  return {
    title: dict.candles.churchHeading,
    description: dict.candles.churchDescription,
    alternates: buildAlternates("/candles/church", lang),
  };
}

export default async function ChurchCandlesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const allCandles = await getCandles(lang as Locale);
  const candles = allCandles.filter((candle) => candle.category === "church");

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold text-burgundy dark:text-dark-text sm:text-5xl">
            {dict.candles.churchHeading}
          </h1>
          <p className="mt-3 text-charcoal/70 dark:text-dark-text/70">
            {dict.candles.churchDescription}
          </p>
        </div>

        <div className="mt-14">
          <CandleGrid
            candles={candles}
            lang={lang as Locale}
            viewDetailsLabel={dict.candles.viewDetails}
            priceOnRequestLabel={dict.common.priceOnRequest}
            currency={dict.common.currency}
            emptyLabel={dict.candles.emptyState}
          />
        </div>
      </Container>
    </section>
  );
}
