import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // @ts-expect-error - expected eslint
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
