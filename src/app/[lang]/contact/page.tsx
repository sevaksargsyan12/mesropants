import { notFound } from "next/navigation";
import { Phone, MapPin } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getContactPageData } from "@/lib/graphql/queries/contact";
import Container from "@/components/ui/Container";
import SocialLinks from "@/components/layout/SocialLinks";
import ContactForm from "@/components/contact/ContactForm";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const { contactHeading, contactSubheading, siteSettings } =
    await getContactPageData(lang as Locale);
  const phoneHref = `tel:${siteSettings.phoneNumber.replace(/[^\d+]/g, "")}`;
  const socialLinks = {
    instagram: siteSettings.instagramLink,
    facebook: siteSettings.facebookLink,
    whatsapp: siteSettings.whatsappLink,
  };

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold text-burgundy dark:text-dark-text sm:text-5xl">
            {contactHeading}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-charcoal/70 dark:text-dark-text/70">
            {contactSubheading}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="rounded-2xl border border-gold/25 bg-cream-dark/50 p-6 dark:bg-dark-bg-soft/50">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy text-gold">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-burgundy/60 dark:text-dark-text/60">
                      {dict.contact.phoneLabel}
                    </p>
                    <a
                      href={phoneHref}
                      className="text-sm font-medium text-charcoal hover:text-gold-dark dark:text-dark-text"
                    >
                      {siteSettings.phoneDisplayNumber}
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy text-gold">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-burgundy/60 dark:text-dark-text/60">
                      {dict.contact.addressLabel}
                    </p>
                    <p className="text-sm font-medium text-charcoal dark:text-dark-text">
                      {siteSettings.address}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-burgundy/70 dark:text-dark-text/70">
                {dict.footer.followUs}
              </h2>
              <SocialLinks
                labels={dict.social}
                links={socialLinks}
                className="mt-3 text-burgundy dark:text-dark-text"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gold/25 bg-white p-6 dark:bg-dark-bg-soft sm:p-8">
            <h2 className="font-display text-lg font-semibold text-burgundy dark:text-dark-text">
              {dict.contact.formHeading}
            </h2>
            <div className="mt-6">
              <ContactForm dict={dict.contact} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
