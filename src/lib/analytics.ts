/**
 * Vendor-neutral analytics bridge.
 *
 * Today: routes events to GA4 (gtag) when consent is granted.
 * Future: same call sites work with PostHog / Plausible / Mixpanel —
 * just add another branch in `track()` and the rest of the codebase
 * is untouched.
 */

/** Closed event-name vocabulary. Add new events here, NOT inline strings. */
export type EventName =
  | "beta_signup_completed"
  | "newsletter_subscribed"
  | "clinic_application_submitted"
  | "review_submitted"
  | "hero_search_performed"
  | "consent_granted"
  | "consent_denied";

type EventProps = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Track a typed event. Safe to call from anywhere — no-ops on the
 * server, when gtag isn't loaded, or when the user hasn't consented
 * (Consent Mode v2 quietly drops events in that case).
 */
export function track(event: EventName, props?: EventProps) {
  if (typeof window === "undefined") return;

  // GA4 via gtag — consent-mode aware. If analytics_storage is 'denied'
  // gtag silently buffers/drops the event, no client-side gating needed.
  if (typeof window.gtag === "function") {
    window.gtag("event", event, props ?? {});
  }

  // Future providers go here (PostHog, Plausible, etc.)
  // if (window.posthog) window.posthog.capture(event, props);
}

/* ─────────────────────────────────────────────────────────────
 * Consent helpers — read/write the longevo_consent cookie and
 * push the corresponding signal into Google Consent Mode v2.
 * ───────────────────────────────────────────────────────────── */

export type ConsentState = {
  analytics: boolean;
  marketing: boolean;
  ts: string; // ISO timestamp
};

const COOKIE_NAME = "longevo_consent";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function readConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`${COOKIE_NAME}=([^;]+)`)
  );
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as ConsentState;
  } catch {
    return null;
  }
}

export function writeConsent(state: Omit<ConsentState, "ts">) {
  if (typeof document === "undefined") return;
  const full: ConsentState = { ...state, ts: new Date().toISOString() };
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(full)
  )}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;

  // Update Google Consent Mode v2 in real time
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: state.analytics ? "granted" : "denied",
      ad_storage: state.marketing ? "granted" : "denied",
      ad_user_data: state.marketing ? "granted" : "denied",
      ad_personalization: state.marketing ? "granted" : "denied",
    });
  }

  track(state.analytics ? "consent_granted" : "consent_denied", {
    analytics: state.analytics,
    marketing: state.marketing,
  });
}
