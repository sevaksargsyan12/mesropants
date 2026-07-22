// Shaped like a future ACF Options Page ("Site Settings"), queried once via
// WPGraphQL and shared across Header, Footer, and the Contact page.
export type SiteSettings = {
  phone: string;
  phoneHref: string;
  email: string;
  address: string;
  social: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
};

export const siteSettings: SiteSettings = {
  phone: "+374 55 123 456",
  phoneHref: "tel:+37455123456",
  email: "info@mesropants.am",
  address: "Երևան, Հայաստան",
  social: {
    instagram: "https://instagram.com/mesropants",
    facebook: "https://facebook.com/mesropants",
    whatsapp: "https://wa.me/37455123456",
  },
};
