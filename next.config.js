/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['localhost', '3lismaeel.xyz']
  },
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://3lismaeel.xyz' : ''
}

module.exports = nextConfig 