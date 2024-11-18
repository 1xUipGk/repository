/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['blogger.googleusercontent.com', 'www.blogger.com']
  },
  basePath: process.env.NODE_ENV === 'production' ? '/repository-main' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/repository-main/' : '',
  reactStrictMode: true,
  swcMinify: false
}

module.exports = nextConfig
