/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/repository',
  assetPrefix: '/repository/',
  swcMinify: false,
  webpack: (config) => {
    config.optimization.minimize = false;
    return config;
  }
}

module.exports = nextConfig
