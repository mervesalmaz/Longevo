import Link from "next/link";

/**
 * Rewritten from scratch to enforce: no (#) placeholder links, no empty
 * sections, no App Store badges until we actually ship an app. Every link
 * points to a real route or a target that WILL exist before public launch.
 *
 * Launch blocker: /yasal/* pages must be drafted with a lawyer before we
 * leave private beta. KVKK + Kullanım Koşulları are not optional in TR.
 */

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterColumn = {
  id: string;
  heading: string;
  links: FooterLink[];
};

const columns: FooterColumn[] = [
  {
    id: "footer-about",
    heading: "Longevo hakkında",
    links: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Basın", href: "mailto:press@longevo.life", external: true },
      { label: "İletişim", href: "/iletisim" },
    ],
  },
  {
    id: "footer-explore",
    heading: "Keşfet",
    links: [
      { label: "Klinikler", href: "/search" },
      { label: "Tedaviler", href: "/tr/tedaviler" },
      { label: "Şehirler", href: "/tr/sehirler" },
      { label: "Rehber", href: "/tr/rehber" },
    ],
  },
  {
    id: "footer-community",
    heading: "Topluluk",
    links: [
      { label: "Yorum yaz", href: "/reviews/new" },
      { label: "Bülten", href: "/#newsletter" },
    ],
  },
  {
    id: "footer-clinics",
    heading: "Klinik sahipleri",
    links: [
      { label: "Klinik kaydı", href: "/klinik-kaydi" },
      { label: "SSS", href: "/klinik-kaydi/sss" },
    ],
  },
  {
    id: "footer-legal",
    heading: "Yasal",
    links: [
      { label: "Kullanım koşulları", href: "/yasal/kullanim-kosullari" },
      { label: "Gizlilik politikası", href: "/yasal/gizlilik" },
      { label: "KVKK aydınlatma", href: "/yasal/kvkk" },
      { label: "Çerez politikası", href: "/yasal/cerez" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main nav — 5 columns */}
        <nav
          aria-label="Site haritası"
          className="grid grid-cols-2 md:grid-cols-5 gap-8 py-16"
        >
          {columns.map((col) => (
            <div key={col.id}>
              <h3
                id={col.id}
                className="text-sm font-medium text-neutral-900 mb-4"
              >
                {col.heading}
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
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="hover:text-neutral-900 transition-colors"
                      >
                        {link.label}
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
              aria-label="Longevo ana sayfa"
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
            <span>
              © 2026 Longevo. Türkiye&apos;nin longevity rehberi.
            </span>
          </div>

          {/*
            Language selector — Turkish-first.
            English is shown muted as a signal it's on the roadmap.
            When we localize the full public surface to EN, turn the
            English span into a working button that sets the locale cookie.
          */}
          <div className="flex items-center gap-4 text-sm">
            <span
              aria-current="true"
              className="inline-flex items-center gap-1.5 text-neutral-900"
            >
              <span aria-hidden>🇹🇷</span> Türkçe
            </span>
            <span
              aria-disabled="true"
              title="İngilizce yakında"
              className="inline-flex items-center gap-1.5 text-neutral-400 cursor-not-allowed"
            >
              <span aria-hidden>🇬🇧</span> English
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
