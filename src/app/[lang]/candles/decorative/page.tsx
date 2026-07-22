import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getCandlesByCategory } from "@/lib/mock/candles";
import Container from "@/components/ui/Container";
import CandleGrid from "@/components/candles/CandleGrid";

export default async function DecorativeCandlesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const candles = getCandlesByCategory("decorative");

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold text-burgundy dark:text-dark-text sm:text-5xl">
            {dict.candles.decorativeHeading}
          </h1>
          <p className="mt-3 text-charcoal/70 dark:text-dark-text/70">
            {dict.candles.decorativeDescription}
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
