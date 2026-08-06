import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/mesropants_wp/wp-content/uploads/**",
      },
    ],
    // The WP backend runs on localhost for local dev; Next 16 blocks
    // optimizing images from private/local IPs by default (SSRF guard).
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
