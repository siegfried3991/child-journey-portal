import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Multipart evidence uploads are capped at 10 MB by the API, with room for form headers.
  experimental: { serverActions: { bodySizeLimit: "11mb" } },
};

export default nextConfig;
