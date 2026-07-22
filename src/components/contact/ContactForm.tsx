"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/lib/i18n/getDictionary";

type ContactFormProps = {
  dict: Dictionary["contact"];
};

export default function ContactForm({ dict }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // No backend yet -- this is UI only until the form is wired up.
    setSubmitted(true);
  }

  const inputClasses =
    "w-full rounded-xl border border-burgundy/15 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 dark:border-dark-text/20 dark:bg-dark-bg-soft dark:text-dark-text dark:placeholder:text-dark-text/40";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-semibold text-burgundy dark:text-dark-text"
        >
          {dict.formNameLabel}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder={dict.formNamePlaceholder}
          className={inputClasses}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-semibold text-burgundy dark:text-dark-text"
        >
          {dict.formEmailLabel}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={dict.formEmailPlaceholder}
          className={inputClasses}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-semibold text-burgundy dark:text-dark-text"
        >
          {dict.formMessageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder={dict.formMessagePlaceholder}
          className={`${inputClasses} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-burgundy px-6 py-3 text-sm font-semibold uppercase tracking-wide text-cream transition-colors duration-200 hover:bg-burgundy-light"
      >
        {dict.formSubmit}
      </button>

      {submitted && (
        <p className="text-sm font-medium text-gold-dark" role="status">
          {dict.formSuccess}
        </p>
      )}
    </form>
  );
}
