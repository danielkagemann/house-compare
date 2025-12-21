import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  distDir: "build",
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
