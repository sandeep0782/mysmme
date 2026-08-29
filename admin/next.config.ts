import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  allowedDevOrigins: ["10.214.48.87"],

  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
