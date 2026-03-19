/** @type {import('next').NextConfig} */
const nextConfig = {
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
