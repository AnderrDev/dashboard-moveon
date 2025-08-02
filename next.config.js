/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.exprContextCritical = false;
    return config;
  },
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
