import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
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

  const about = await getAboutContent(lang);
  return {
    title: about.aboutHeading,
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

  const about = await getAboutContent(lang as Locale);

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="text-center">
          <RevealText
            as="h1"
            text={about.aboutHeading}
            className="font-display text-4xl font-semibold text-burgundy dark:text-dark-text sm:text-5xl"
          />
          <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-gold-dark">
            {about.foundedYear}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-[7rem] rounded-b-2xl border border-gold/30">
            {about.aboutImage ? (
              <Image
                src={about.aboutImage.url}
                alt={about.aboutImage.altText || about.aboutHeading}
                fill
                sizes="(min-width: 1024px) 448px, 90vw"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-cream-dark dark:bg-dark-bg-soft" />
            )}
          </div>

          <div>
            <div
              className="leading-relaxed text-charcoal/80 [&_p]:mb-4 last:[&_p]:mb-0 dark:text-dark-text/80"
              dangerouslySetInnerHTML={{ __html: about.aboutText }}
            />

            <div className="mt-10 rounded-2xl border border-gold/25 bg-cream-dark/50 p-6 dark:bg-dark-bg-soft/50">
              <RevealText
                as="h2"
                text={about.missionHeading}
                className="font-display text-lg font-semibold text-burgundy dark:text-dark-text"
              />
              <p className="mt-2 text-sm leading-relaxed text-charcoal/75 dark:text-dark-text/75">
                {about.missionText}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
