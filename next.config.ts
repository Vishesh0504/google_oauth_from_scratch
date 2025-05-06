import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(nextConfig: NextConfig) {
    nextConfig.module.rules.push({
      test: /\.svg$/,
      issuer: { and: [/\.(js|ts)x?$/] },
      use: ["@svgr/webpack"],
    });
    return nextConfig;
  },
};

export default nextConfig;
