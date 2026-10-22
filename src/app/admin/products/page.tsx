import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPaise } from "@/lib/utils";
import { AdminNav } from "@/components/admin/admin-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Plus, CheckCircle2, XCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminProductsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/account/login");

  const [products, categories] = await Promise.all([
    db.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        variants: true,
      },
    }),
    db.category.findMany(),
  ]);

  // Server action to toggle product publishing
  async function togglePublishAction(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return;

    const productId = formData.get("productId") as string;
    const current = formData.get("isPublished") === "true";

    await db.product.update({
      where: { id: productId },
      data: { isPublished: !current },
    });

    revalidatePath("/admin/products");
  }

  // Server action to create a new product
  async function createProductAction(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return;

    const name = formData.get("name") as string;
    const slug = (formData.get("slug") as string).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const categoryId = formData.get("categoryId") as string;
    const price = parseFloat(formData.get("price") as string) || 199;
    const stock = parseInt(formData.get("stock") as string) || 50;
    const sku = (formData.get("sku") as string).toUpperCase() || `BOT-${Date.now()}`;
    const description = (formData.get("description") as string) || "Premium botanical specimen.";
    const imageUrl = (formData.get("imageUrl") as string) || "/images/about/heirloom-seeds.jpg";

    const product = await db.product.create({
      data: {
        name,
        slug,
        categoryId,
        description,
        images: [imageUrl],
        isPublished: true,
        variants: {
          create: {
            sku,
            title: "Standard Pack",
            pricePaise: Math.round(price * 100),
            stock,
          },
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
  }

  return (
    <div className="min-h-screen bg-[#F7F4EA] flex flex-col lg:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#DCD5C1] gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565]">
                Catalogue Inventory
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#153F2D] mt-0.5">
                Product Management
              </h1>
              <p className="text-xs text-[#5A5E53] mt-1">
                Create new botanical items, adjust pricing, manage variants and toggle visibility.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Products Table (2 Columns) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#DCD5C1] overflow-hidden shadow-xs">
              <div className="p-5 border-b border-[#DCD5C1] flex items-center justify-between">
                <h2 className="font-serif font-bold text-base text-[#153F2D]">
                  All Products ({products.length})
                </h2>
                <span className="text-xs text-[#5A5E53]">
                  {products.filter((p) => p.isPublished).length} Active Online
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EDE7D8]/50 text-[#153F2D] uppercase font-bold border-b border-[#DCD5C1]">
                    <tr>
                      <th className="px-5 py-3.5">Product</th>
                      <th className="px-5 py-3.5">Category</th>
                      <th className="px-5 py-3.5">Variants &amp; Price</th>
                      <th className="px-5 py-3.5">Stock</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCD5C1]">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#F7F4EA]/40 transition-colors">
                        <td className="px-5 py-3.5 flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-[#EDE7D8] shrink-0 border border-[#DCD5C1]">
                            <Image
                              src={prod.images[0] || "/images/placeholder.jpg"}
                              alt={prod.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/products/${prod.slug}`}
                              target="_blank"
                              className="font-serif font-bold text-sm text-[#153F2D] hover:underline line-clamp-1"
                            >
                              {prod.name}
                            </Link>
                            <span className="text-[#8C9083] text-[11px]">{prod.slug}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-[#5A5E53]">
                          {prod.category.name}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-[#153F2D]">
                          {formatPaise(prod.variants[0]?.pricePaise || 0)}
                          <span className="text-[10px] text-[#8C9083] font-normal block">
                            {prod.variants.length} variant(s)
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`font-semibold ${
                            (prod.variants[0]?.stock || 0) <= 5
                              ? "text-[#C87855]"
                              : "text-[#153F2D]"
                          }`}>
                            {prod.variants.reduce((acc, v) => acc + v.stock, 0)} units
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge
                            variant={prod.isPublished ? "sage" : "outline"}
                            className="text-[10px]"
                          >
                            {prod.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <form action={togglePublishAction} className="inline-block">
                            <input type="hidden" name="productId" value={prod.id} />
                            <input type="hidden" name="isPublished" value={String(prod.isPublished)} />
                            <Button variant="outline" size="sm" type="submit" className="text-xs">
                              {prod.isPublished ? "Unpublish" : "Publish"}
                            </Button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Product Creator Form (1 Column) */}
            <div className="bg-white p-6 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-lg text-[#153F2D]">
                Add New Product
              </h2>
              <form action={createProductAction} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" required placeholder="e.g. Heirloom Radish Seeds" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" required placeholder="heirloom-radish-seeds" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="categoryId">Category</Label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    required
                    className="w-full bg-white border border-[#DCD5C1] rounded-md px-3 py-2 text-xs text-[#282B25] focus:ring-1 focus:ring-[#153F2D]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="price">Price (₹ INR)</Label>
                    <Input id="price" name="price" type="number" required defaultValue="199" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="stock">Initial Stock</Label>
                    <Input id="stock" name="stock" type="number" required defaultValue="50" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="sku">SKU Code</Label>
                  <Input id="sku" name="sku" required placeholder="BOT-RAD-01" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    defaultValue="/images/about/heirloom-seeds.jpg"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    required
                    defaultValue="High germination botanical variety suited for home container gardening."
                    className="w-full bg-white border border-[#DCD5C1] rounded-md p-2.5 text-xs text-[#282B25] focus:outline-none focus:ring-1 focus:ring-[#153F2D]"
                  />
                </div>

                <Button type="submit" variant="default" className="w-full font-semibold">
                  Save &amp; Publish Product
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
