/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const proxyTarget = process.env.API_PROXY_TARGET;
    if (!proxyTarget) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${proxyTarget.replace(/\/$/, "")}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;