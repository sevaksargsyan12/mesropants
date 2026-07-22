import type { Locale } from "@/lib/i18n/config";

// Shaped like a Polylang-translated WordPress Page with ACF fields.
// In production this becomes one WPGraphQL query per locale returning
// `page(id: "about") { foundedYear, aboutText }`.
export type AboutContent = {
  foundedYear: number;
  aboutText: string;
};

export const aboutContent: Record<Locale, AboutContent> = {
  hy: {
    foundedYear: 1998,
    aboutText:
      "Մեսրոպանցի պատմությունը սկսվել է փոքր ընտանեկան արհեստանոցից, որտեղ առաջին մոմերը ձուլվում էին ձեռքով՝ հին տեխնիկայով։ Տարիների ընթացքում արհեստանոցը մեծացել է, սակայն մնացել է հավատարիմ իր սկզբունքներին՝ որակ, բնականություն և հարգանք ավանդույթի հանդեպ։ Այսօր Մեսրոպանցը արտադրում է ինչպես եկեղեցական մոմեր՝ տաճարների և տնային աղոթարանների համար, այնպես էլ դեկորատիվ մոմեր՝ ժամանակակից տների ու նվերների համար։ Յուրաքանչյուր մոմ անցնում է մի քանի փուլով՝ մոմանյութի ընտրությունից մինչև ձեռքով հղկում ու փաթեթավորում։",
  },
  ru: {
    foundedYear: 1998,
    aboutText:
      "История Mesropants началась с небольшой семейной мастерской, где первые свечи отливались вручную по старинной технологии. Со временем мастерская выросла, но осталась верна своим принципам — качеству, натуральности и уважению к традиции. Сегодня Mesropants производит как церковные свечи для храмов и домашних молелен, так и декоративные свечи для современных домов и подарков. Каждая свеча проходит несколько этапов — от выбора воска до ручной полировки и упаковки.",
  },
  en: {
    foundedYear: 1998,
    aboutText:
      "The story of Mesropants began in a small family workshop, where the first candles were hand-poured using age-old technique. Over the years the workshop grew, but stayed true to its principles — quality, natural materials, and respect for tradition. Today Mesropants makes both church candles for temples and home prayer corners, and decorative candles for modern homes and gifts. Every candle goes through several stages, from selecting the wax to hand-finishing and packaging.",
  },
};

export function getAboutContent(locale: Locale): AboutContent {
  return aboutContent[locale];
}
