import type { NextConfig } from "next";

const repo = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  basePath: repo,
  assetPrefix: repo,
  images: {
    unoptimized: true, // wichtig für GH Pages, da kein Image-Optimizer-Server läuft
  },
  output: "export",
};

export default nextConfig;
