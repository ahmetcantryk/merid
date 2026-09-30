import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  // String form keeps the plugin serialisable for Turbopack.
  options: { remarkPlugins: [["remark-gfm", {}]] },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["@meridui/react"],
  reactStrictMode: true,
  // Preview deployments must never be indexed, whatever robots.txt a crawler cached.
  async headers() {
    if (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] }];
  },
};

export default withMDX(nextConfig);
