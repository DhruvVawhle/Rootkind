import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rootkind.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/cart",
          "/checkout",
          "/account/",
          "/admin/",
          "/order-confirmation/",
          "/api/",
          "/wishlist",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
