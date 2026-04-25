import type { NextConfig } from "next";
import { SECURITY_HEADERS } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      // Force HTTPS — fixes http/https canonical split seen in GSC
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
        destination: "https://wadecv.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...SECURITY_HEADERS],
      },
    ];
  },
};

export default nextConfig;
