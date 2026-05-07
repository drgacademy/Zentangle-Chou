import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Sanity CDN images at runtime when content arrives.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
