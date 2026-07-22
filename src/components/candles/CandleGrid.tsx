import type { Candle } from "@/types/candle";
import type { Locale } from "@/lib/i18n/config";
import CandleCard from "./CandleCard";

type CandleGridProps = {
  candles: Candle[];
  lang: Locale;
  viewDetailsLabel: string;
  priceOnRequestLabel: string;
  currency: string;
  emptyLabel: string;
};

export default function CandleGrid({
  candles,
  lang,
  viewDetailsLabel,
  priceOnRequestLabel,
  currency,
  emptyLabel,
}: CandleGridProps) {
  if (candles.length === 0) {
    return (
      <p className="py-12 text-center text-charcoal/60 dark:text-dark-text/60">
        {emptyLabel}
      </p>
    );
  }

  // With 3 desktop columns, a lone item left over in the final row (e.g. 4 or
  // 7 candles) would otherwise sit flush left -- center it under the row above.
  const isOrphan = candles.length % 3 === 1;

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {candles.map((candle, index) => (
        <CandleCard
          key={candle.id}
          candle={candle}
          lang={lang}
          index={index}
          centered={isOrphan && index === candles.length - 1}
          viewDetailsLabel={viewDetailsLabel}
          priceOnRequestLabel={priceOnRequestLabel}
          currency={currency}
        />
      ))}
    </div>
  );
}
