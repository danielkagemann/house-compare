import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
   distDir: 'build',
   output: 'export',
   images: {
      unoptimized: true,
   },
   trailingSlash: true,
};

export default withNextIntl(nextConfig);
