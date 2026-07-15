"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/locale-provider";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-50 border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-4">{t("footer_about")}</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black">{t("footer_about_us")}</a></li>
              <li><a href="#" className="hover:text-black">{t("footer_press")}</a></li>
              <li><a href="#" className="hover:text-black">{t("footer_resources")}</a></li>
              <li><a href="#" className="hover:text-black">{t("footer_careers")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer_explore")}</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/search" className="hover:text-black">{t("footer_clinics")}</Link></li>
              <li><Link href="/search" className="hover:text-black">{t("footer_treatments")}</Link></li>
              <li><a href="#" className="hover:text-black">{t("footer_reviews")}</a></li>
              <li><a href="#" className="hover:text-black">{t("footer_top_destinations")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer_business")}</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black">{t("footer_owners")}</a></li>
              <li><a href="#" className="hover:text-black">{t("footer_advertise")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer_app")}</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black">iPhone</a></li>
              <li><a href="#" className="hover:text-black">Android</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer_more")}</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black">{t("footer_help")}</a></li>
              <li><a href="#" className="hover:text-black">{t("footer_contact")}</a></li>
              <li><Link href="/search?city=Istanbul" className="hover:text-black">Istanbul</Link></li>
              <li><Link href="/search?city=Berlin" className="hover:text-black">Berlin</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#34E0A1"/>
              <path d="M16 8C12.134 8 9 11.134 9 15C9 18.866 12.134 22 16 22C19.866 22 23 18.866 23 15C23 11.134 19.866 8 16 8ZM16 20C13.243 20 11 17.757 11 15C11 12.243 13.243 10 16 10C18.757 10 21 12.243 21 15C21 17.757 18.757 20 16 20Z" fill="white"/>
              <circle cx="16" cy="15" r="3" fill="white"/>
            </svg>
            <span className="text-sm text-gray-600">{t("footer_copyright")}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-black">{t("footer_terms")}</a>
            <a href="#" className="hover:text-black">{t("footer_privacy")}</a>
            <a href="#" className="hover:text-black">{t("footer_cookies")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
