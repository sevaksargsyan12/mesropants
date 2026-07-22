import "server-only";
import type { Locale } from "./config";

const dictionaries = {
  hy: () => import("./dictionaries/hy.json").then((module) => module.default),
  ru: () => import("./dictionaries/ru.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["hy"]>>;

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
