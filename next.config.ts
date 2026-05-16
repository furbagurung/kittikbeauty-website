import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kittikbeauty.com",
      },
      {
        protocol: "https",
        hostname: "www.kittikbeauty.com",
      },
      {
        protocol: "https",
        hostname: "kittik.furkedesigns.com",
      },
    ],
  },
};

export default nextConfig;
