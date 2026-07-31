"use client";

import { useMemo, useState } from "react";
import type { Candle } from "@/types/candle";
import type { Locale } from "@/lib/i18n/config";
import CandleGrid from "./CandleGrid";

type CandleTabsProps = {
  candles: Candle[];
  lang: Locale;
  churchTabLabel: string;
  decorativeTabLabel: string;
  viewDetailsLabel: string;
  priceOnRequestLabel: string;
  currency: string;
  emptyLabel: string;
};

type Tab = "church" | "decorative";

export default function CandleTabs({
  candles,
  lang,
  churchTabLabel,
  decorativeTabLabel,
  viewDetailsLabel,
  priceOnRequestLabel,
  currency,
  emptyLabel,
}: CandleTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("church");

  const tabs: { id: Tab; label: string }[] = [
    { id: "church", label: churchTabLabel },
    { id: "decorative", label: decorativeTabLabel },
  ];

  // Already-fetched data, filtered in memory -- switching tabs never
  // triggers a network request.
  const activeCandles = useMemo(
    () => candles.filter((candle) => candle.category === activeTab),
    [candles, activeTab]
  );

  return (
    <div>
      <div className="flex justify-center gap-10 border-b border-burgundy/15 dark:border-dark-text/15">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-4 text-sm font-semibold uppercase tracking-widest transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-gold-dark"
                : "text-charcoal/50 hover:text-charcoal dark:text-dark-text/50 dark:hover:text-dark-text"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gold" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-12">
        <CandleGrid
          candles={activeCandles}
          lang={lang}
          viewDetailsLabel={viewDetailsLabel}
          priceOnRequestLabel={priceOnRequestLabel}
          currency={currency}
          emptyLabel={emptyLabel}
        />
      </div>
    </div>
  );
}
