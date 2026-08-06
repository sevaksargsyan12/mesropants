import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getCandles, getCandlesPageContent } from "@/lib/graphql/queries/candles";
import { buildAlternates } from "@/lib/seo";
import Container from "@/components/ui/Container";
import CandleTabs from "@/components/candles/CandleTabs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const pageContent = await getCandlesPageContent(lang);
  return {
    title: pageContent.candlesPageHeading,
    description: pageContent.candlesPageSubheading,
    alternates: buildAlternates("/candles", lang),
  };
}

export default async function CandlesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const pageContent = await getCandlesPageContent(lang as Locale);
  const candles = await getCandles(lang as Locale);

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold text-burgundy dark:text-dark-text sm:text-5xl">
            {pageContent.candlesPageHeading}
          </h1>
          <p className="mt-3 text-charcoal/70 dark:text-dark-text/70">
            {pageContent.candlesPageSubheading}
          </p>
        </div>

        <div className="mt-14">
          <CandleTabs
            candles={candles}
            lang={lang as Locale}
            churchTabLabel={dict.candles.churchTab}
            decorativeTabLabel={dict.candles.decorativeTab}
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
