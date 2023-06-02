/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

import withBundleAnalyzer from "@next/bundle-analyzer";
import nextPWA from "next-pwa";

const withPWA = nextPWA({
	dest: "public",
  register: true,
  skipWaiting: true,
  dynamicStartUrl: false,
  disable: process.env.NODE_ENV === "development",
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

export default withBundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
})(withPWA(nextConfig));
