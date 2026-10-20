import path from "node:path";
import type { NextConfig } from "next";

const apiTarget =
  process.env.API_INTERNAL_URL ??
  "http://127.0.0.1:5000";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@sonora/ui",
  ],

  turbopack: {
    root: path.resolve(
      process.cwd(),
      "../..",
    ),
  },

  async rewrites() {
    return [
      {
        source:
          "/api/v1/:path*",
        destination:
          `${apiTarget}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;