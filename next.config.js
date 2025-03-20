/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com"
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org"
      }
      // ... any existing patterns ...
    ]
  }
};

module.exports = nextConfig;
