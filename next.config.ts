import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "images.airtasker.com" },
    ],
  },
};

export default nextConfig;
