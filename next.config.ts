import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // turbo: false, // Turn off Turbopack
  images: {
    domains: [
      "jmhfhviddckxfopvvwoe.supabase.co",
      "i.pravatar.cc",
      "picsum.photos",
      "imgbin.com",
      "example.com",
    ], // 👈 add your Supabase project ref
  },
};

export default nextConfig;
