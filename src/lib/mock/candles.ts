import type { Candle } from "@/types/candle";

// Mock data shaped to be a drop-in replacement for a future WPGraphQL + ACF
// query (headless WordPress + Polylang). Field names mirror the Candle type
// exactly so swapping this module for a GraphQL fetcher requires no changes
// to consuming components.
export const candles: Candle[] = [
  {
    id: "1",
    slug: "khachov-mom",
    name: "Եկեղեցական մոմ՝ խաչի պատկերով",
    category: "church",
    featuredImage: {
      url: "/images/candles/church/e05df231-7b3c-4822-a004-8749c3b72627.png",
      altText: "Սպիտակ ապակյա եկեղեցական մոմ՝ փորագրված խաչով",
    },
    description:
      "Ավանդական սպիտակ մոմ՝ ապակե անոթի մեջ, խաչի նուրբ փորագրությամբ։ Հարմար է տաճարների և տնային աղոթարանների համար։",
    price: 1200,
    showPrice: true,
  },
  {
    id: "2",
    slug: "karmir-apakya-mom",
    name: "Կարմիր ապակյա մոմ",
    category: "church",
    featuredImage: {
      url: "/images/candles/church/775da2a5-0ca8-4220-a0c0-e56a7d42af3e.png",
      altText: "Կարմիր ապակե անոթի մեջ վառվող եկեղեցական մոմ",
    },
    description:
      "Երկարավառ կարմիր մոմ՝ խիտ ապակե անոթի մեջ։ Այրվում է հավասարաչափ և երկար ժամանակ՝ առանց ծխի։",
    price: 1500,
    showPrice: true,
  },
  {
    id: "3",
    slug: "spitak-svecheri-havakacu",
    name: "Սպիտակ մոմերի հավաքածու",
    category: "church",
    featuredImage: {
      url: "/images/candles/church/5f7f791a-2375-4b63-8f47-31cd857f4351.png",
      altText: "Հինգ սպիտակ մոմ՝ տարբեր բարձրություններով",
    },
    description:
      "Դասական սպիտակ մոմերի հավաքածու՝ զոհասեղանի և ընտանեկան արարողությունների համար։",
    price: 900,
    showPrice: true,
  },
  {
    id: "4",
    slug: "meghramome-erkar-momer",
    name: "Մեղրամոմե երկար մոմեր",
    category: "church",
    featuredImage: {
      url: "/images/candles/church/27a818d4-ba35-4164-be82-355bb5307dba.png",
      altText: "Կապով կապված մեղրամոմե երկար մոմերի փունջ",
    },
    description:
      "100% բնական մեղրամոմից պատրաստված բարակ ու երկար մոմեր՝ կապված բնական պարանով։ Հատուկ պատվերով քանակություն։",
    price: null,
    showPrice: false,
  },
  {
    id: "5",
    slug: "voloryun-dekorativ-momer",
    name: "Ոլորուն դեկորատիվ մոմեր",
    category: "decorative",
    featuredImage: {
      url: "/images/candles/decorative/13d03317-c95b-4473-88f3-d3cc5e04d95f.png",
      altText: "Վարդագույն և մանուշակագույն ոլորուն դեկորատիվ մոմեր",
    },
    description:
      "Զույգ նուրբ ոլորուն մոմեր՝ վարդագույն և մանուշակագույն երանգներով։ Հիանալի են սեղանի դեկորի համար։",
    price: 3200,
    showPrice: true,
  },
  {
    id: "6",
    slug: "caghkacev-mom",
    name: "Ծաղկաձև մոմ",
    category: "decorative",
    featuredImage: {
      url: "/images/candles/decorative/43531f43-ff08-462b-b2cb-a24d1263b7f7.png",
      altText: "Ծաղկի տեսքով փորագրված մոմ՝ կերամիկական ամանի մեջ",
    },
    description:
      "Ձեռագործ ծաղկաձև մոմ՝ նուրբ, թերթիկավոր ձևով։ Ամանը ներառված է հավաքածուի մեջ։",
    price: 4500,
    showPrice: true,
  },
  {
    id: "7",
    slug: "bubble-cube-mom",
    name: "«Bubble» կուբիկաձև մոմ",
    category: "decorative",
    featuredImage: {
      url: "/images/candles/decorative/407078ce-8ee9-45fb-97a0-e1f31c35a887.png",
      altText: "Գնդիկներից բաղկացած կուբիկաձև դեկորատիվ մոմ",
    },
    description:
      "Ժամանակակից դիզայնով «bubble» մոմ՝ գնդիկաձև մակերեսով։ Աչքի ընկնող դետալ ցանկացած ինտերիերում։",
    price: 3800,
    showPrice: true,
  },
  {
    id: "8",
    slug: "reliefayin-momeri-havakacu",
    name: "Ռելիեֆային մոմերի հավաքածու",
    category: "decorative",
    featuredImage: {
      url: "/images/candles/decorative/e4a1cc61-f9bc-4ca4-9d79-7e6f03f6f24c.png",
      altText: "Երեք ռելիեֆային մոմեր՝ տարբեր բարձրություններով և գույներով",
    },
    description:
      "Երեք ռելիեֆային մոմերից բաղկացած հավաքածու՝ crème, բեժ և վարդագույն երանգներով։ Իդեալական է նվերի համար։",
    price: 5200,
    showPrice: true,
  },
];

export function getAllCandles(): Candle[] {
  return candles;
}

export function getCandlesByCategory(category: Candle["category"]): Candle[] {
  return candles.filter((candle) => candle.category === category);
}

export function getCandleBySlug(slug: string): Candle | undefined {
  return candles.find((candle) => candle.slug === slug);
}
