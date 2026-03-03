import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'primary.jwwb.nl',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '*.firebasestorage.app',
      },
    ],
  },
  // Ensure we don't accidentally bundle server-only packages like stripe into the client
  serverExternalPackages: ['stripe'],
  experimental: {
    // Keep it empty for now if not needed, or add other flags
  },
  // Try turbopack at top level as suggested by some docs/warnings
  // @ts-ignore - Turbopack root config might not be in the current type definition
  turbopack: {
    root: process.cwd(),
  }
};

export default nextConfig;
