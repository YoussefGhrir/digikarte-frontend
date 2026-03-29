/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Rewrites URL préfixées /de|/fr|/en vers l’arborescence réelle (app/dashboard, app/impressum, …).
   * Nécessaire car sans cela Next tente app/[locale]/impressum etc. (inexistant) → 404 sur prefetch RSC.
   * Aligné sur middleware.ts (rewritePrefixes).
   */
  async rewrites() {
    const locales = ["de", "fr", "en"];
    const prefixes = ["dashboard", "login", "register", "impressum", "datenschutz", "agb", "menu"];
    const rules = [];
    for (const loc of locales) {
      for (const p of prefixes) {
        rules.push({ source: `/${loc}/${p}`, destination: `/${p}` });
        rules.push({ source: `/${loc}/${p}/:path*`, destination: `/${p}/:path*` });
      }
    }

    // Proxy API Java : le navigateur appelle /api/... sur le même hôte que le front (CSP connect-src 'self').
    // Évite un NEXT_PUBLIC_API_BASE_URL « faux » ou obsolète qui pointe vers un Heroku vide alors que la prod est ailleurs.
    const rawBackend =
      process.env.API_BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://127.0.0.1:8080"
        : "https://digicarte-043d88a805be.herokuapp.com");
    const apiBackend = rawBackend.replace(/\/$/, "");
    rules.push({ source: "/api/:path*", destination: `${apiBackend}/api/:path*` });

    return rules;
  },

  // Production hardening:
  // remove console.* calls from client bundles in production builds.
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Keep browser source maps disabled in production.
  productionBrowserSourceMaps: false,
  async headers() {
    // In development, Next.js React Refresh needs eval/websocket.
    // Keep strict CSP only in production.
    if (process.env.NODE_ENV !== "production") {
      return [];
    }

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self' https: data:; connect-src 'self' https:;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
