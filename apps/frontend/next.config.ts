// MODULES //
import path from "path";

// OTHERS //
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
