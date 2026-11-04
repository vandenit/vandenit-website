/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Ship the raw content/ files into the standalone bundle so the build-time
  // content pipeline can read them during build.
  outputFileTracingIncludes: {
    '/*': ['./content/**/*'],
  },
  // Next 16: Turbopack defaults (empty object = engine defaults).
  turbopack: {},
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

module.exports = nextConfig