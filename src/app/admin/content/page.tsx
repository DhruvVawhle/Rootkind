import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, HelpCircle, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminContentPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/account/login");

  const [articles, faqs] = await Promise.all([
    db.article.findMany({ orderBy: { createdAt: "desc" } }),
    db.fAQ.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  // Server action to add new article
  async function createArticleAction(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return;

    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const coverImage = (formData.get("coverImage") as string) || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80";

    await db.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        coverImage,
        authorName: user.name,
      },
    });

    revalidatePath("/admin/content");
    revalidatePath("/journal");
  }

  // Server action to add FAQ
  async function createFaqAction(formData: FormData) {
    "use server";
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return;

    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const category = formData.get("category") as string;

    await db.fAQ.create({
      data: { question, answer, category },
    });

    revalidatePath("/admin/content");
    revalidatePath("/faq");
  }

  return (
    <div className="min-h-screen bg-[#F7F4EA] flex flex-col lg:flex-row">
      <AdminNav />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#DCD5C1] gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565]">
                Editorial &amp; Knowledge Base
              </span>
              <h1 className="font-serif text-3xl font-bold text-[#153F2D] mt-0.5">
                Content &amp; FAQ Management
              </h1>
              <p className="text-xs text-[#5A5E53] mt-1">
                Publish educational growing guides and manage customer FAQs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Journal Articles Management */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#DCD5C1] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#DCD5C1]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#153F2D]" />
                    <h2 className="font-serif font-bold text-base text-[#153F2D]">
                      Gardening Journal Articles ({articles.length})
                    </h2>
                  </div>
                </div>

                <div className="divide-y divide-[#DCD5C1] text-xs max-h-80 overflow-y-auto pr-1">
                  {articles.map((art) => (
                    <div key={art.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/journal/${art.slug}`}
                          target="_blank"
                          className="font-serif font-bold text-sm text-[#153F2D] hover:underline"
                        >
                          {art.title}
                        </Link>
                        <Badge variant="outline" className="text-[10px]">
                          {art.category}
                        </Badge>
                      </div>
                      <p className="text-[#5A5E53] mt-1 line-clamp-2">{art.excerpt}</p>
                      <span className="text-[10px] text-[#8C9083] mt-1 block">
                        Published on {formatDate(art.publishedAt)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Article Form */}
              <div className="bg-white p-6 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-4 text-xs">
                <h3 className="font-serif font-bold text-base text-[#153F2D]">
                  Publish New Article
                </h3>
                <form action={createArticleAction} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="artTitle">Article Title</Label>
                    <Input id="artTitle" name="title" required placeholder="e.g. Companion Planting for Balcony Tomatoes" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="artSlug">Slug</Label>
                    <Input id="artSlug" name="slug" required placeholder="companion-planting-balcony-tomatoes" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="artCat">Category</Label>
                    <Input id="artCat" name="category" required defaultValue="Growing Guides" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="artExcerpt">Short Excerpt</Label>
                    <Input id="artExcerpt" name="excerpt" required placeholder="1-2 sentences summarizing the key takeaway..." />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="artContent">Markdown Content</Label>
                    <textarea
                      id="artContent"
                      name="content"
                      rows={4}
                      required
                      placeholder="Write educational markdown content..."
                      className="w-full bg-white border border-[#DCD5C1] rounded-md p-2.5 text-xs text-[#282B25] focus:outline-none focus:ring-1 focus:ring-[#153F2D]"
                    />
                  </div>

                  <Button type="submit" variant="default" size="sm" className="w-full font-semibold">
                    Publish Guide
                  </Button>
                </form>
              </div>
            </div>

            {/* FAQs Management */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#DCD5C1] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#DCD5C1]">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#153F2D]" />
                    <h2 className="font-serif font-bold text-base text-[#153F2D]">
                      Customer FAQs ({faqs.length})
                    </h2>
                  </div>
                </div>

                <div className="divide-y divide-[#DCD5C1] text-xs max-h-80 overflow-y-auto pr-1">
                  {faqs.map((f) => (
                    <div key={f.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-[#153F2D]">{f.question}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          {f.category}
                        </Badge>
                      </div>
                      <p className="text-[#5A5E53] line-clamp-2">{f.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add FAQ Form */}
              <div className="bg-white p-6 rounded-2xl border border-[#DCD5C1] shadow-xs space-y-4 text-xs">
                <h3 className="font-serif font-bold text-base text-[#153F2D]">
                  Add New FAQ Entry
                </h3>
                <form action={createFaqAction} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="faqCat">Category</Label>
                    <Input id="faqCat" name="category" required defaultValue="Seeds & Germination" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="question">Question</Label>
                    <Input id="question" name="question" required placeholder="e.g. How long does potting mix stay fresh?" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="answer">Answer</Label>
                    <textarea
                      id="answer"
                      name="answer"
                      rows={3}
                      required
                      placeholder="Clear, helpful response for home growers..."
                      className="w-full bg-white border border-[#DCD5C1] rounded-md p-2.5 text-xs text-[#282B25] focus:outline-none focus:ring-1 focus:ring-[#153F2D]"
                    />
                  </div>

                  <Button type="submit" variant="default" size="sm" className="w-full font-semibold">
                    Save FAQ
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
