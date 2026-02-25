/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      // .html extension ko hatane ke liye
      {
        source: '/:path*.html',
        destination: '/:path*',
        permanent: true,
      },
      // .htm extension ko hatane ke liye
      {
        source: '/:path*.htm',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;