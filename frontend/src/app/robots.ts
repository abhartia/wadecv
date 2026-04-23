import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://wadecv.com";

  const publicDisallow = [
    "/api/",
    "/dashboard",
    "/tailor",
    "/applications",
    "/settings",
    "/billing",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: publicDisallow,
      },
      // Explicitly allow AI crawlers — future-proofs against CDN/WAF
      // default-block changes (e.g. Cloudflare blocking AI bots by default)
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "anthropic-ai",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
          "cohere-ai",
        ],
        allow: "/",
        disallow: publicDisallow,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
