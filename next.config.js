/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['blogger.googleusercontent.com', 'www.blogger.com']
  },
  basePath: process.env.NODE_ENV === 'production' ? '/repository' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/repository/' : '',
}

module.exports = nextConfig
