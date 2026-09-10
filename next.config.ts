import type { NextConfig } from "next";

const allowIndexing = process.env.ALLOW_INDEXING === "true";

const nextConfig: NextConfig = {
  async headers() {
    if (allowIndexing) return [];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },
};

export default nextConfig;
