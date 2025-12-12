/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Enable i18n
  i18n: {
    locales: ['en', 'fr', 'ar'],
    defaultLocale: 'en',
  },
};

module.exports = nextConfig;
