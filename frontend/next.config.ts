import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["192.168.1.12"],
  images: {
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
};

export default nextConfig;
