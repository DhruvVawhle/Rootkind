import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductDetail } from "@/components/ProductDetail";

export default async function InterceptedProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: any = null;

  try {
    product = await db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: {
          orderBy: { pricePaise: "asc" },
        },
      },
    });
  } catch (error) {
    console.warn("[InterceptedProductPage] DB error, using fallback:", error);
  }

  if (!product) {
    // If product is not found in database, check fallback
    notFound();
  }

  return <ProductDetail product={product} isModal={true} />;
}
