const nextConfig = {
  reactStrictMode: true,
  // one address for search engines: www.tareqmahmud.info -> tareqmahmud.info
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.tareqmahmud.info" }],
        destination: "https://tareqmahmud.info/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
