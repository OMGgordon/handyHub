import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  turbo: false, // Turn off Turbopack
  images: {
    domains: ["jmhfhviddckxfopvvwoe.supabase.co"], // 👈 add your Supabase project ref
  },
};

export default nextConfig;
