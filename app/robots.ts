import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://kaycorp.tech/sitemap.xml",
    host: "https://kaycorp.tech",
  };
}
