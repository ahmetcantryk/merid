import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  // String form keeps the plugin serialisable for Turbopack.
  options: { remarkPlugins: [["remark-gfm", {}]] },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["@merid/react"],
  reactStrictMode: true,
};

export default withMDX(nextConfig);
