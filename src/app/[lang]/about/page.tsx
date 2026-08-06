import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getAboutContent } from "@/lib/graphql/queries/about";
import { buildAlternates } from "@/lib/seo";
import { htmlToText } from "@/lib/sanitize";
import Container from "@/components/ui/Container";
import RevealText from "@/components/ui/RevealText";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);
  const about = await getAboutContent(lang);
  return {
    title: dict.about.pageTitle,
    description: htmlToText(about.aboutText).slice(0, 160),
    alternates: buildAlternates("/about", lang),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const about = await getAboutContent(lang as Locale);

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="text-center">
          <RevealText
            as="h1"
            text={dict.about.pageTitle}
            className="font-display text-4xl font-semibold text-burgundy dark:text-dark-text sm:text-5xl"
          />
          <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-gold-dark">
            {about.foundedYear}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-[7rem] rounded-b-2xl border border-gold/30">
            <Image
              src="/images/candles/church/5f7f791a-2375-4b63-8f47-31cd857f4351.png"
              alt={dict.about.pageTitle}
              fill
              sizes="(min-width: 1024px) 448px, 90vw"
              className="object-cover"
            />
          </div>

          <div>
            <div
              className="leading-relaxed text-charcoal/80 [&_p]:mb-4 last:[&_p]:mb-0 dark:text-dark-text/80"
              dangerouslySetInnerHTML={{ __html: about.aboutText }}
            />

            <div className="mt-10 rounded-2xl border border-gold/25 bg-cream-dark/50 p-6 dark:bg-dark-bg-soft/50">
              <RevealText
                as="h2"
                text={dict.about.missionHeading}
                className="font-display text-lg font-semibold text-burgundy dark:text-dark-text"
              />
              <p className="mt-2 text-sm leading-relaxed text-charcoal/75 dark:text-dark-text/75">
                {dict.about.missionText}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
