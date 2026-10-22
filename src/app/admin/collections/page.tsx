import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layers, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminCollectionsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/account/login");

  const [categories, collections] = await Promise.all([
    db.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    db.collection.findMany({
      include: { _count: { select: { products: true } } },
    }),
  ]);

  // Server action to create category
  async function createCategoryAction(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return;

    const name = formData.get("name") as string;
    const slug = (formData.get("slug") as string).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const description = formData.get("description") as string;
    const image = (formData.get("image") as string) || "/images/about/heirloom-seeds.jpg";

    await db.category.create({
      data: { name, slug, description, image },
    });

    revalidatePath("/admin/collections");
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
                Taxonomy &amp; Merchandising
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#153F2D] mt-0.5">
                Categories &amp; Collections
              </h1>
              <p className="text-xs text-[#5A5E53] mt-1">
                Organize botanical catalogue groups and featured seasonal collections.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Categories Table (2 Columns) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-[#DCD5C1] overflow-hidden shadow-xs">
                <div className="p-5 border-b border-[#DCD5C1]">
                  <h2 className="font-serif font-bold text-base text-[#153F2D]">
                    Product Categories ({categories.length})
                  </h2>
                </div>
                <div className="divide-y divide-[#DCD5C1] text-xs">
                  {categories.map((c) => (
                    <div key={c.id} className="p-4 flex items-center justify-between hover:bg-[#F7F4EA]/40">
                      <div>
                        <Link
                          href={`/collections/${c.slug}`}
                          target="_blank"
                          className="font-serif font-bold text-sm text-[#153F2D] hover:underline"
                        >
                          {c.name}
                        </Link>
                        <p className="text-[#8C9083] text-[11px] mt-0.5">{c.description}</p>
                      </div>
                      <span className="font-semibold text-[#153F2D] bg-[#EDE7D8] px-2.5 py-1 rounded-full">
                        {c._count.products} products
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collections List */}
              <div className="bg-white rounded-2xl border border-[#DCD5C1] overflow-hidden shadow-xs">
                <div className="p-5 border-b border-[#DCD5C1]">
                  <h2 className="font-serif font-bold text-base text-[#153F2D]">
                    Curated Collections ({collections.length})
                  </h2>
                </div>
                <div className="divide-y divide-[#DCD5C1] text-xs">
                  {collections.map((col) => (
                    <div key={col.id} className="p-4 flex items-center justify-between hover:bg-[#F7F4EA]/40">
                      <div>
                        <span className="font-serif font-bold text-sm text-[#153F2D]">
                          {col.name}
                        </span>
                        <p className="text-[#8C9083] text-[11px] mt-0.5">{col.description}</p>
                      </div>
                      <span className="text-[#7D9565] font-semibold text-[11px]">
                        {col.isFeatured ? "Featured on Home" : "Standard"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Create Category Form (1 Column) */}
            <div className="bg-white p-6 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-lg text-[#153F2D]">
                Add New Category
              </h2>
              <form action={createCategoryAction} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <Label htmlFor="name">Category Name</Label>
                  <Input id="name" name="name" required placeholder="e.g. Edible Flowers" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" required placeholder="edible-flowers" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    defaultValue="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    required
                    placeholder="Brief description of this botanical category..."
                    className="w-full bg-white border border-[#DCD5C1] rounded-md p-2.5 text-xs text-[#282B25] focus:ring-1 focus:ring-[#153F2D]"
                  />
                </div>

                <Button type="submit" variant="default" className="w-full font-semibold">
                  Save Category
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
