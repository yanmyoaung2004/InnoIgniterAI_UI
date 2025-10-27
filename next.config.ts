import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      // Your turbopack config
    },
  },
  poweredByHeader: false,
};

export default nextConfig;
