import type { NextConfig } from "next";

// STATIC_EXPORT=1 emits a fully static site into ./out (GitHub Pages, Netlify,
// Cloudflare Pages, S3, …). BASE_PATH prefixes every asset/route, which GitHub
// project Pages needs (e.g. /Portfolio). Unset = normal server build.
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(staticExport
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        basePath: basePath || undefined,
        assetPrefix: basePath || undefined,
      }
    : {}),
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;