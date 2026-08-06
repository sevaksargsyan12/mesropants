"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/lib/i18n/getDictionary";

type ContactFormProps = {
  dict: Dictionary["contact"];
};

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm({ dict }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Honeypot: real visitors never see or fill this field (visually hidden,
    // not tab-reachable); anything that populates it is a bot. Pretend
    // success without actually submitting, so the bot doesn't learn it was caught.
    if (formData.get("company")) {
      setStatus("success");
      form.reset();
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_REST_URL}/mesropants/v1/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
            company: formData.get("company") ?? "",
          }),
        }
      );

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data = await res.json();
      if (!data.success) throw new Error("Request did not report success");

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
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

      {/* Honeypot -- visually hidden and unreachable by keyboard for real
          visitors, but a plain <input> (not type="hidden") so naive bots
          that blindly fill every form field still populate it. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center rounded-full bg-burgundy px-6 py-3 text-sm font-semibold uppercase tracking-wide text-cream transition-colors duration-200 hover:bg-burgundy-light disabled:opacity-60"
      >
        {dict.formSubmit}
      </button>

      {status === "success" && (
        <p className="text-sm font-medium text-gold-dark" role="status">
          {dict.formSuccess}
        </p>
      )}

      {status === "error" && (
        <p className="text-sm font-medium text-red-600" role="alert">
          {dict.formError}
        </p>
      )}
    </form>
  );
}
