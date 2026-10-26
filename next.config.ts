import type { NextConfig } from "next";

// Static export for GitHub Pages (anuj1102001.github.io). Images are prepared ahead of time by
// scripts/assets.mjs, so the Next image optimiser is off.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
