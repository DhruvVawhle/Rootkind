import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rootkind.in";

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/returns-refunds`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  try {
    // Dynamic products
    const products = await db.product.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Dynamic collections
    const collections = await db.collection.findMany({
      select: { slug: true, updatedAt: true },
    });

    const collectionRoutes: MetadataRoute.Sitemap = collections.map((col) => ({
      url: `${baseUrl}/collections/${col.slug}`,
      lastModified: col.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Dynamic journal articles
    const articles = await db.article.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
      url: `${baseUrl}/journal/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...collectionRoutes, ...articleRoutes];
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
    return staticRoutes;
  }
}
