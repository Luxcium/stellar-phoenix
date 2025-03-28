/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for standalone deployment
  output: 'standalone',

  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/storage/**',
      },
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Disable x-powered-by header
  poweredByHeader: false,

  // Enable React strict mode
  reactStrictMode: true,

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
    // Enable optimized loading of third-party scripts
    optimizeCss: true,
    // Enable module resolution for better tree-shaking
    esmExternals: true,
  },

  // Configure webpack for better performance
  webpack: (config, { dev, isServer }) => {
    // Optimize production builds
    if (!dev) {
      // Enable terser minification
      config.optimization.minimize = true;
    }

    // Add support for native node modules
    if (isServer) {
      config.externals.push('sharp');
    }

    return config;
  },

  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
    NEXT_PUBLIC_ALLOWED_MIME_TYPES: process.env.ALLOWED_MIME_TYPES,
    NEXT_PUBLIC_ENABLE_IMAGE_OPTIMIZATION: process.env.ENABLE_IMAGE_OPTIMIZATION,
  },

  // Headers to improve security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirect configuration
  async redirects() {
    return [
      {
        source: '/images',
        destination: '/gallery',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
