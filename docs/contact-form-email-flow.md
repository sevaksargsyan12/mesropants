# Contact form → email notification flow (implementation prompt)

This is a self-contained spec/prompt you can hand to Claude (or any dev) in
another project to implement the same contact-form-to-email flow used in the
Bayazet Hall site. It's written as an instruction set, not tied to Next.js
specifically — adapt the file layout to whatever framework the target
project uses (see "Framework adaptation" at the end).

## What to build

A contact form that POSTs to a backend endpoint, which validates the input
server-side and sends a notification email via **Resend**
(https://resend.com), with specific `from`/`to`/`bcc`/`reply-to` routing.

## Architecture — 4 separate responsibilities, 4 files

Keep these as distinct modules — don't collapse them. Each has exactly one
job, and validation in particular must be shared (not re-implemented) between
client and server.

1. **Client-side form component** (`ContactForm`)
   - Controlled inputs for the fields (see "Fields & validation" below).
   - Runs the *same* validation module on submit for instant inline
     error messages before ever hitting the network.
   - POSTs JSON to the API endpoint (`Content-Type: application/json`).
   - Three UI states: idle/submitting → success (clear the form, show a
     confirmation message) → error (show either field-level errors from the
     server, or a generic retry message on network/server failure).

2. **Shared validation module** (`validate-contact`)
   - One function: `validateContactPayload(payload) -> fieldErrors`.
   - Imported by *both* the client component (pre-submit UX) and the API
     route (real enforcement — never trust the client alone).
   - Returns a map of `{ fieldName: errorMessage }`, empty object = valid.

3. **API endpoint** (`POST /api/contact`)
   - Parses the request body (reject unparseable JSON with a 500/`server`
     error, don't crash).
   - Re-validates with the shared module. On failure: `400` with
     `{ ok: false, error: "validation", fieldErrors }`.
   - On success: calls the notify function. If it throws, catch and return
     `500` with `{ ok: false, error: "server" }` — never report `ok: true`
     for a submission that didn't actually send.
   - On full success: `200` with `{ ok: true }`.

4. **Notify/email module** (server-side only — never imported by client code)
   - Builds the email subject/body from the validated payload.
   - Calls Resend's API. **Resend's SDK returns `{ data, error }` — it does
     not throw on API-level failures.** Explicitly check `error` and
     `throw` so the failure propagates into the API route's catch block.
     Skipping this check is the most likely way to silently swallow a
     failed send while still telling the user it worked.
   - Escapes user-submitted text before interpolating into the HTML email
     body (prevents HTML/markup injection into the notification email).
     Do **not** apply that same HTML-escaping to values used as email
     *headers* (e.g. the reply-to address) — headers want the raw value,
     not HTML-entity-escaped text.

## Email routing — the specific semantics to replicate

This is the part most worth getting exactly right:

| Field | Value | Why |
|---|---|---|
| `from` | A dedicated no-reply sending address on a domain verified with Resend | Never send "as" the recipient or an unverified address |
| `to` | The real staff inbox, from an env var (e.g. `CONTACT_FORM_RECIPIENT`) | Single visible primary recipient |
| `bcc` | An optional second/personal inbox, from a second env var (e.g. `CONTACT_FORM_RECIPIENT2`) | Gets a silent copy — must never appear in `to`/`cc`, so it's invisible to the primary recipient |
| `reply-to` | The **form submitter's own email address** | So a staff member hitting "reply" in their mail client goes straight back to the customer — not to the unmonitored no-reply sender, and not into a void |

## Fields & validation (adapt names/limits to your form)

| Field | Rule |
|---|---|
| `name` | 2–100 characters |
| `phone` | Starts with `+` or a digit, 6–20 chars total, digits/spaces/hyphens/parens allowed |
| `email` | Basic `x@y.z` shape (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) |
| `message` | 10–2000 characters |

## Environment variables

```
RESEND_API_KEY=              # server-side secret — must NOT be exposed to
                              # client bundles (no public/browser-visible
                              # prefix on this variable name)
CONTACT_FORM_RECIPIENT=      # primary visible "to" / notification inbox
CONTACT_FORM_RECIPIENT2=     # optional — silent bcc copy
```

Document these (with empty values) in whatever `.env.example`-equivalent the
target project uses; put real values only in the git-ignored local env file.

## Error handling summary

- Validation failure → `400`, field-level errors, shown inline on the form.
- Anything else going wrong (bad JSON, Resend `error`, thrown exception) →
  `500`, generic retry message on the client.
- Never let a failed send result in `{ ok: true }`.

## Framework adaptation notes

- The reference implementation is Next.js App Router: `ContactForm.tsx`
  (client component) → `POST /api/contact` (route handler) →
  `validate-contact.ts` (shared, framework-agnostic) → `contact-notify.ts`
  (server-only Resend call). In Express/Fastify/etc., the "API endpoint"
  is just a normal route handler; the "shared validation module" still
  needs to be importable from both the frontend build and the backend
  process (a plain, dependency-free function is easiest to share).
- If the target project isn't JS/TS, keep the same four responsibilities
  and the same routing table above — the Resend HTTP API is plain REST,
  so any language's HTTP client can call it directly with the same
  `from`/`to`/`bcc`/`reply_to`/`subject`/`html` fields.
