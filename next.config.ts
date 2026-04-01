import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  experimental: {
    webpackBuildWorker: false,
  },

  turbopack: {},
};

export default nextConfig;
