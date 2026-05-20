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
    ];
  },
};

export default nextConfig;
