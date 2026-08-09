"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import { validateContactPayload, type ContactFieldErrors } from "@/lib/validate-contact";

type ContactFormProps = {
  dict: Dictionary["contact"];
};

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm({ dict }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});

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

    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    // Run the same validation the API route enforces, for instant inline
    // errors before ever hitting the network.
    const errors = validateContactPayload(payload);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      return;
    }

    setFieldErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, company: formData.get("company") ?? "" }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "validation" && data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        throw new Error(data.error ?? "server");
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const inputClasses =
    "w-full rounded-xl border border-burgundy/15 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 dark:border-dark-text/20 dark:bg-dark-bg-soft dark:text-dark-text dark:placeholder:text-dark-text/40";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
        {fieldErrors.name && (
          <p className="mt-1.5 text-xs font-medium text-red-600">{dict.formErrors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-sm font-semibold text-burgundy dark:text-dark-text"
        >
          {dict.formPhoneLabel}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder={dict.formPhonePlaceholder}
          className={inputClasses}
        />
        {fieldErrors.phone && (
          <p className="mt-1.5 text-xs font-medium text-red-600">{dict.formErrors.phone}</p>
        )}
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
        {fieldErrors.email && (
          <p className="mt-1.5 text-xs font-medium text-red-600">{dict.formErrors.email}</p>
        )}
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
        {fieldErrors.message && (
          <p className="mt-1.5 text-xs font-medium text-red-600">{dict.formErrors.message}</p>
        )}
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

      {status === "error" && Object.keys(fieldErrors).length === 0 && (
        <p className="text-sm font-medium text-red-600" role="alert">
          {dict.formError}
        </p>
      )}
    </form>
  );
}
