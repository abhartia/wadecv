import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://wadecv.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/tailor", "/applications", "/settings", "/billing"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
