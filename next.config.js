/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production hardening:
  // remove console.* calls from client bundles in production builds.
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Keep browser source maps disabled in production.
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
