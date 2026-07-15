import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Newsletter subscribe endpoint.
 *
 * Strategy: Always write to our own `newsletter_subscribers` table first
 * so we own the list. If an external provider is configured via env vars,
 * also forward to them. Provider failure does NOT fail the whole request —
 * the email is recorded and we retry out-of-band if needed.
 *
 * Env:
 *   NEWSLETTER_PROVIDER   'beehiiv' | 'convertkit' | (unset → local only)
 *   NEWSLETTER_API_KEY
 *   NEWSLETTER_PUBLICATION_ID   (beehiiv)
 *   NEWSLETTER_FORM_ID          (convertkit)
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubscribeBody = { email?: string };

export async function POST(request: Request) {
  let body: SubscribeBody;
  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // 1. Local write — source of truth
  const { error: insertError } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, source: "home_newsletter" });

  if (insertError) {
    // Unique violation → already subscribed, treat as success
    if (insertError.code === "23505") {
      return NextResponse.json({ ok: true, already: true });
    }
    // Table missing (pre-migration) or other DB error
    return NextResponse.json(
      { error: "db_error", detail: insertError.message },
      { status: 500 }
    );
  }

  // 2. Optional external provider forwarding (fire-and-note)
  const provider = process.env.NEWSLETTER_PROVIDER;
  const apiKey = process.env.NEWSLETTER_API_KEY;

  if (provider && apiKey) {
    try {
      let res: Response | null = null;

      if (provider === "beehiiv") {
        const pubId = process.env.NEWSLETTER_PUBLICATION_ID;
        if (!pubId) throw new Error("NEWSLETTER_PUBLICATION_ID missing");
        res = await fetch(
          `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              reactivate_existing: true,
              send_welcome_email: true,
              utm_source: "longevo.life",
            }),
          }
        );
      } else if (provider === "convertkit") {
        const formId = process.env.NEWSLETTER_FORM_ID;
        if (!formId) throw new Error("NEWSLETTER_FORM_ID missing");
        res = await fetch(
          `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ api_key: apiKey, email }),
          }
        );
      }

      if (res && res.ok) {
        await supabase
          .from("newsletter_subscribers")
          .update({ provider_synced: true })
          .eq("email", email);
      } else if (res) {
        const text = await res.text();
        await supabase
          .from("newsletter_subscribers")
          .update({
            provider_synced: false,
            provider_error: `HTTP ${res.status}: ${text.slice(0, 500)}`,
          })
          .eq("email", email);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await supabase
        .from("newsletter_subscribers")
        .update({ provider_error: message.slice(0, 500) })
        .eq("email", email);
    }
  }

  return NextResponse.json({ ok: true });
}
