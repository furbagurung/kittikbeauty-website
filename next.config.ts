import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  htmlLimitedBots: /.*/,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
