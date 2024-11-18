/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['blogger.googleusercontent.com', 'www.blogger.com']
  },
  basePath: process.env.NODE_ENV === 'production' ? '/repository' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/repository/' : '',
  swcMinify: false,
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.minimize = false;
    }
    return config;
  },
  distDir: process.env.NODE_ENV === 'development' ? '.next' : 'out',
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  experimental: {
    forceSwcTransforms: true,
  }
}

module.exports = nextConfig
