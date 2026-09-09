const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        // /skills/<collection> → its README page (the entry point used by
        // blog posts linking to a skills directory)
        source: '/skills/:collection',
        destination: '/skills/:collection/README',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      // Add your image domains here if needed
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

}

module.exports = withContentlayer(nextConfig)
