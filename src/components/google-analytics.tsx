import Script from "next/script";

/**
 * Google Analytics 4 with Consent Mode v2.
 *
 * Strategy (KVKK-compliant):
 *   1. gtag.js loads on every request (small, async)
 *   2. Initial consent state = ALL DENIED — no cookies, no PII collected
 *   3. CookieConsent component flips analytics_storage to 'granted'
 *      after the user explicitly accepts. gtag then replays buffered
 *      events with full data.
 *   4. If env var missing, component renders nothing — gracefully
 *      degrades for local/preview envs without GA setup.
 */
export function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!GA_ID) return null;

  return (
    <>
      {/* Init script — runs BEFORE gtag.js so consent default is set */}
      <Script id="ga-consent-init" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;

          // Consent Mode v2 — default to denied per KVKK/GDPR
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500
          });

          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            anonymize_ip: true,
            send_page_view: true
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
