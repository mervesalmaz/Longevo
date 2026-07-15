"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { treatments } from "@/data/treatments";

type NavItem = {
  label: string;
  href: string;
  /** When true, renders a dropdown trigger instead of a plain link. */
  hasDropdown?: boolean;
};

const navItems: NavItem[] = [
  { label: "Klinikler", href: "/search" },
  { label: "Tedaviler", href: "/tr/tedaviler", hasDropdown: true },
  { label: "Şehirler", href: "/tr/sehirler" },
  { label: "Rehber", href: "/tr/rehber" },
  { label: "Topluluk", href: "/reviews" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Longevo ana sayfa"
          className="flex items-center gap-2 flex-shrink-0"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="16" cy="16" r="16" fill="hsl(var(--longevo-green))" />
            <path
              d="M16 8C12.134 8 9 11.134 9 15C9 18.866 12.134 22 16 22C19.866 22 23 18.866 23 15C23 11.134 19.866 8 16 8ZM16 20C13.243 20 11 17.757 11 15C11 12.243 13.243 10 16 10C18.757 10 21 12.243 21 15C21 17.757 18.757 20 16 20Z"
              fill="black"
            />
            <circle cx="16" cy="15" r="3" fill="black" />
          </svg>
          <span className="font-semibold text-lg text-neutral-900 tracking-tight">
            Longevo
          </span>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: "hsl(var(--longevo-green) / 0.15)",
              color: "hsl(var(--longevo-green))",
            }}
          >
            Beta
          </span>
        </Link>

        {/* Center nav — desktop only */}
        <nav
          aria-label="Ana navigasyon"
          className="hidden md:flex items-center gap-1"
        >
          {navItems.map((item) =>
            item.hasDropdown ? (
              <TreatmentsDropdown
                key={item.href}
                item={item}
                active={isActive(item.href)}
              />
            ) : (
              <NavLink
                key={item.href}
                item={item}
                active={isActive(item.href)}
              />
            )
          )}
        </nav>

        {/* Right CTAs */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            asChild
            variant="ghost"
            className="hidden md:inline-flex text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <Link href="/reviews/new">Yorum yaz</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="hidden md:inline-flex text-white"
            style={{ backgroundColor: "hsl(var(--longevo-green))" }}
          >
            {/* TODO: /login short route can be added as a next.config rewrite to /auth/login. */}
            <Link href="/auth/login">Giriş</Link>
          </Button>

          {/* Mobile: hamburger → Sheet drawer */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menüyü aç"
                className="text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] bg-white border-l border-neutral-200 p-0"
            >
              <MobileMenu
                pathname={pathname}
                onClose={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Desktop: plain nav link
 * ───────────────────────────────────────────────────────────── */
function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "text-neutral-900 bg-neutral-100"
          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70"
      }`}
    >
      {item.label}
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Desktop: Tedaviler dropdown
 * Radix DropdownMenu handles Esc, arrow keys, focus trap.
 * ───────────────────────────────────────────────────────────── */
function TreatmentsDropdown({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-current={active ? "page" : undefined}
          className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 ${
            active
              ? "text-neutral-900 bg-neutral-100"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70"
          }`}
        >
          {item.label}
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-72 bg-white border border-neutral-200 p-2 shadow-lg"
      >
        <div className="grid grid-cols-2 gap-1">
          {treatments.map((t) => {
            const Icon = t.icon;
            return (
              <DropdownMenuItem key={t.slug} asChild className="cursor-pointer">
                <Link
                  href={`/tr/tedaviler/${t.slug}`}
                  className="flex items-start gap-2.5 p-2 rounded-md hover:bg-neutral-100 focus:bg-neutral-100"
                >
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded flex items-center justify-center mt-0.5"
                    style={{
                      backgroundColor: "hsl(var(--longevo-green) / 0.12)",
                    }}
                  >
                    <Icon
                      style={{
                        color: "hsl(var(--longevo-green))",
                        width: 14,
                        height: 14,
                      }}
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-neutral-900 truncate">
                      {t.title}
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate">
                      {t.description}
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </div>
        <div className="border-t border-neutral-200 mt-2 pt-2">
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link
              href="/tr/tedaviler"
              className="flex items-center justify-between p-2 rounded-md hover:bg-neutral-100 focus:bg-neutral-100 text-sm font-medium"
              style={{ color: "hsl(var(--longevo-green))" }}
            >
              Tüm tedaviler
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Mobile drawer menu
 * Radix Sheet handles focus trap + Esc + overlay click.
 * ───────────────────────────────────────────────────────────── */
function MobileMenu({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2"
          aria-label="Longevo ana sayfa"
        >
          <span className="font-semibold text-lg text-neutral-900">Longevo</span>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: "hsl(var(--longevo-green) / 0.15)",
              color: "hsl(var(--longevo-green))",
            }}
          >
            Beta
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Menüyü kapat"
          className="text-neutral-600 hover:text-neutral-900"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Nav */}
      <nav aria-label="Ana navigasyon" className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-neutral-900 bg-neutral-100"
                    : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100/70"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Tedaviler sub-links (always expanded on mobile) */}
        <div className="mt-4 px-2">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider px-3 mb-2">
            Popüler tedaviler
          </div>
          <ul className="space-y-0.5">
            {treatments.slice(0, 6).map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tr/tedaviler/${t.slug}`}
                  onClick={onClose}
                  className="block px-3 py-2 rounded-md text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70 transition-colors"
                >
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* CTAs */}
      <div className="border-t border-neutral-200 p-4 space-y-2">
        <Button
          asChild
          variant="outline"
          className="w-full border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
          onClick={onClose}
        >
          <Link href="/reviews/new">Yorum yaz</Link>
        </Button>
        <Button
          asChild
          className="w-full text-white"
          style={{ backgroundColor: "hsl(var(--longevo-green))" }}
          onClick={onClose}
        >
          <Link href="/auth/login">Giriş</Link>
        </Button>
      </div>
    </div>
  );
}
