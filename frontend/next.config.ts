import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sharp jaisi native (non-JS) packages ko Next.js ke bundler se bahar rakhta hai
  // warna build/runtime mein "sharp module not found" jaisa error aa sakta hai
  serverExternalPackages: ["sharp"],

  experimental: {
    serverActions: {
      bodySizeLimit: "65mb", // tumhara 60MB folder upload isse bina reject hue jayega
    },
    middlewareClientMaxBodySize: "65mb",
  },
};

export default nextConfig;