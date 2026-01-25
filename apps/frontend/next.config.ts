import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://cdn.discordapp.com/avatars/**")],
  },
  allowedDevOrigins: [
    "192.168.0.100",
    "localhost"
  ]
};

export default nextConfig;
