import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getT } from "@/lib/i18n/server";
import type { TranslationKey } from "@/lib/i18n/translations";

/**
 * Rewritten from scratch to enforce: no (#) placeholder links, no empty
 * sections, no App Store badges until we actually ship an app. Every link
 * points to a real route or a target that WILL exist before public launch.
 *
 * Launch blocker: /yasal/* pages must be drafted with a lawyer before we
 * leave private beta. KVKK + Kullanım Koşulları are not optional in TR.
 */

type FooterLink = {
  labelKey: TranslationKey;
  href: string;
  external?: boolean;
};

type FooterColumn = {
  id: string;
  headingKey: TranslationKey;
  links: FooterLink[];
};

const columns: FooterColumn[] = [
  {
    id: "footer-about",
    headingKey: "footer_about",
    links: [
      { labelKey: "footer_about_us", href: "/hakkimizda" },
      { labelKey: "footer_press", href: "mailto:press@longevo.life", external: true },
      { labelKey: "footer_contact", href: "/iletisim" },
    ],
  },
  {
    id: "footer-explore",
    headingKey: "footer_explore",
    links: [
      { labelKey: "footer_clinics", href: "/search" },
      { labelKey: "footer_treatments", href: "/tr/tedaviler" },
      { labelKey: "nav_cities", href: "/tr/sehirler" },
      { labelKey: "nav_guide", href: "/tr/rehber" },
    ],
  },
  {
    id: "footer-community",
    headingKey: "nav_community",
    links: [
      { labelKey: "home_hero_share_cta", href: "/reviews/new" },
      { labelKey: "footer_newsletter", href: "/#newsletter" },
    ],
  },
  {
    id: "footer-clinics",
    headingKey: "footer_clinic_owners",
    links: [
      { labelKey: "footer_clinic_register", href: "/klinik-kaydi" },
      { labelKey: "footer_faq", href: "/klinik-kaydi/sss" },
    ],
  },
  {
    id: "footer-legal",
    headingKey: "footer_legal",
    links: [
      { labelKey: "footer_terms_of_use", href: "/yasal/kullanim-kosullari" },
      { labelKey: "footer_privacy_policy", href: "/yasal/gizlilik" },
      { labelKey: "footer_kvkk", href: "/yasal/kvkk" },
      { labelKey: "footer_cookie_policy", href: "/yasal/cerez" },
    ],
  },
];

export default function Footer() {
  const t = getT();
  return (
    <footer className="bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main nav — 5 columns */}
        <nav
          aria-label={t("a11y_sitemap")}
          className="grid grid-cols-2 md:grid-cols-5 gap-8 py-16"
        >
          {columns.map((col) => (
            <div key={col.id}>
              <h3
                id={col.id}
                className="text-sm font-medium text-neutral-900 mb-4"
              >
                {t(col.headingKey)}
              </h3>
              <ul
                aria-labelledby={col.id}
                className="space-y-2.5 text-sm text-neutral-600"
              >
                {col.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="hover:text-neutral-900 transition-colors"
                      >
                        {t(link.labelKey)}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="hover:text-neutral-900 transition-colors"
                      >
                        {t(link.labelKey)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom bar */}
        <div className="border-t border-neutral-100 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <Link
              href="/"
              aria-label={t("a11y_logo_home")}
              className="flex items-center gap-2"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle
                  cx="16"
                  cy="16"
                  r="16"
                  fill="hsl(var(--longevo-green))"
                />
                <path
                  d="M16 8C12.134 8 9 11.134 9 15C9 18.866 12.134 22 16 22C19.866 22 23 18.866 23 15C23 11.134 19.866 8 16 8ZM16 20C13.243 20 11 17.757 11 15C11 12.243 13.243 10 16 10C18.757 10 21 12.243 21 15C21 17.757 18.757 20 16 20Z"
                  fill="black"
                />
                <circle cx="16" cy="15" r="3" fill="black" />
              </svg>
            </Link>
            <span>{t("footer_copyright_tagline")}</span>
          </div>

          {/* Language selector — Turkish default, English available. */}
          <LanguageSwitcher variant="full" />
        </div>
      </div>
    </footer>
  );
}
