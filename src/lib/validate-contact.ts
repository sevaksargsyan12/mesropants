// Shared, framework-agnostic validation -- imported by both the client
// component (instant inline errors before ever hitting the network) and the
// API route (real enforcement; the client-side check alone is never
// trusted). Returns error *codes*, not localized messages, so the caller
// can map them to whatever language the current page is in.

export type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactPayload, "invalid">>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s\-()]*$/;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContactPayload(
  payload: Partial<Record<keyof ContactPayload, unknown>>
): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  const name = asString(payload.name);
  if (name.length < 2 || name.length > 100) errors.name = "invalid";

  const phone = asString(payload.phone);
  if (phone.length < 6 || phone.length > 20 || !PHONE_RE.test(phone)) {
    errors.phone = "invalid";
  }

  const email = asString(payload.email);
  if (!EMAIL_RE.test(email)) errors.email = "invalid";

  const message = asString(payload.message);
  if (message.length < 10 || message.length > 2000) errors.message = "invalid";

  return errors;
}
