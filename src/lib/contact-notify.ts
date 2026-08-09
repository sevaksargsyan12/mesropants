import "server-only";
import nodemailer from "nodemailer";
import type { ContactPayload } from "@/lib/validate-contact";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 465);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const RECIPIENT = process.env.CONTACT_FORM_RECIPIENT;
const RECIPIENT_BCC = process.env.CONTACT_FORM_RECIPIENT2;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Lazily created (and cached) so a missing SMTP config only throws when an
// email is actually attempted, not at module load / build time.
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error(
      "SMTP_HOST, SMTP_USER, and SMTP_PASSWORD must be set to send contact notifications"
    );
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // 465 = implicit TLS; 587/other = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
  return transporter;
}

// nodemailer rejects the returned promise on failure (unlike some providers'
// SDKs, which return `{ data, error }` without throwing) -- a failed send
// propagates naturally into the API route's catch block, no extra check
// needed here.
export async function sendContactNotification(payload: ContactPayload): Promise<void> {
  if (!RECIPIENT) {
    throw new Error("CONTACT_FORM_RECIPIENT is not set");
  }

  const { name, phone, email, message } = payload;

  await getTransporter().sendMail({
    from: `"Mesropants — Website" <${SMTP_USER}>`,
    to: RECIPIENT,
    ...(RECIPIENT_BCC ? { bcc: RECIPIENT_BCC } : {}),
    // The submitter's own address, raw (not HTML-escaped -- this is a
    // header value, not body content) -- so a staff member hitting "reply"
    // goes straight back to the customer.
    replyTo: email,
    subject: `New contact form submission from ${name}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
  });
}
