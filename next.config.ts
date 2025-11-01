import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  distDir: "build",
  output: "export",
  images: {
    unoptimized: true,
  },
  rules: [
    {
      exclude: [path.resolve(__dirname, "api")],
    },
  ],
};

export default nextConfig;
