/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/spettacoli/archivio",
        destination: "/spettacoli#archivio",
        permanent: true,
      },
      {
        source: "/formazione",
        destination: "/caraval-academy",
        permanent: true,
      },
      {
        source: "/formazione/:path*",
        destination: "/caraval-academy/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
