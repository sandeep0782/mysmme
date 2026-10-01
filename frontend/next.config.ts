import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.12"],

  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.meeshosupplyassets.com",
        pathname: "/cataloging/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],

    dangerouslyAllowLocalIP: true,
    qualities: [75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  async redirects() {
    return [
      // =========================================================
      // OLD HOME URL
      // /home → /
      // =========================================================
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },

      // =========================================================
      // OLD ABOUT URL
      // /about → /about-us
      // =========================================================
      {
        source: "/about",
        destination: "/about-us",
        permanent: true,
      },

      // =========================================================
      // OLD FAQ QUERY URL
      // /faq?section=shipping → /faq
      // =========================================================
      {
        source: "/faq",
        has: [
          {
            type: "query",
            key: "section",
            value: "shipping",
          },
        ],
        destination: "/faq",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
