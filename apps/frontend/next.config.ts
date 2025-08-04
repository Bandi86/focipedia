import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Allow Next to transpile internal workspace packages without pre-building them
  transpilePackages: ["@focipedia/ui", "@focipedia/types", "@focipedia/utils"],
};

export default nextConfig;
