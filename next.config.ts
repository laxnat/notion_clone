import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    optimizePackageImports: [
      '@tiptap/react',
      '@tiptap/starter-kit',
      '@tiptap/pm',
      'framer-motion',
      'lucide-react',
    ],
  },
};

export default nextConfig;
