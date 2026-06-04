import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [{ pathname: "/images/**" }, { pathname: "/logos/**" }],
  },
};

export default nextConfig;
