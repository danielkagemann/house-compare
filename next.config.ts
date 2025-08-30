import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  basePath: isProd ? "/house-compare" : "",
  assetPrefix: isProd ? "/house-compare/" : "",
  images: {
    unoptimized: true, // wichtig für GH Pages, da kein Image-Optimizer-Server läuft
  },
  output: "export",
};

export default nextConfig;
