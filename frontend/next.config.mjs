/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/:path*",
      },
      {
        source: "/",
        destination: "/cantina/buy",
      }
    ];
  }
};

export default nextConfig;
