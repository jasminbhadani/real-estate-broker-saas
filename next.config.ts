import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withPWA from "next-pwa";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
})(withNextIntl(nextConfig));