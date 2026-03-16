import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],  // ← moved out of experimental
  turbopack: {},                                // ← silences turbopack warning
};

export default nextConfig;