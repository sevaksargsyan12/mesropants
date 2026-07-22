export type CandleCategory = "church" | "decorative";

export type Candle = {
  id: string;
  slug: string;
  name: string;
  category: CandleCategory;
  featuredImage: { url: string; altText: string } | null;
  description: string | null;
  price: number | null;
  showPrice: boolean;
};
