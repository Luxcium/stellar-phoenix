import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    // ...existing code...
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
