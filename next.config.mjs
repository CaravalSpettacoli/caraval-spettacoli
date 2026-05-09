/** @type {import('next').NextConfig} */
const nextConfig = {
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
