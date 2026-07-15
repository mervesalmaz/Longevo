import type { MetadataRoute } from "next";

/**
 * Dynamic robots.txt for Next.js App Router.
 * Accessible at https://longevo.life/robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/", // admin surface (on main domain already blocked, belt & suspenders)
          "/api/", // API endpoints
          "/auth/", // auth pages shouldn't be indexed
        ],
      },
    ],
    sitemap: "https://longevo.life/sitemap.xml",
    host: "https://longevo.life",
  };
}
