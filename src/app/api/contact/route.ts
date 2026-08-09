import { NextResponse } from "next/server";
import { validateContactPayload } from "@/lib/validate-contact";
import { sendContactNotification } from "@/lib/contact-notify";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }

  // Honeypot: real visitors never see or fill this field, so anything that
  // populates it is a bot -- pretend success without validating or sending,
  // so it doesn't learn it was caught.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const fieldErrors = validateContactPayload(body);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { ok: false, error: "validation", fieldErrors },
      { status: 400 }
    );
  }

  try {
    await sendContactNotification({
      name: String(body.name).trim(),
      phone: String(body.phone).trim(),
      email: String(body.email).trim(),
      message: String(body.message).trim(),
    });
  } catch (err) {
    console.error("Failed to send contact notification email:", err);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
