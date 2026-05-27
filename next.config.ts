import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for 'use cache' directive + cacheLife() in data helpers
  cacheComponents: true,
};

export default nextConfig;
