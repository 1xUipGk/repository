/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-strapi-domain.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
  experimental: {
    esmExternals: 'loose'
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "style-src 'self' 'unsafe-inline'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:",
              "connect-src 'self' http://localhost:1337 https://*.googleapis.com https://identitytoolkit.googleapis.com https://*.firebaseio.com https://securetoken.googleapis.com",
              "img-src 'self' http://localhost:1337 data: blob:",
              "media-src 'self' http://localhost:1337",
              "font-src 'self' data:",
              "frame-src 'self' http://localhost:1337"
            ].join('; ')
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig; 