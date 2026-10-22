import Link from "next/link";
import Image from "next/image";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Sprout, Heart, ShieldCheck, Leaf, ArrowRight, Sparkles, Sun, Droplet } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story — Rootkind Botanical Heritage",
  description:
    "Rootkind was founded with a single mission: to empower urban families to grow their own organic vegetables, herbs, and fruits at home.",
};

export default function AboutPage() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F7F4EA]">
        <AnnouncementBar />
        <Header />
        <CartDrawer />

        <main id="main-content" className="flex-1 py-10 sm:py-20 overflow-x-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
            
            {/* 1. EDITORIAL HERO */}
            <div className="text-center max-w-3xl mx-auto space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#153F2D]/10 text-[#153F2D] text-xs font-semibold uppercase tracking-wider">
                <Sprout className="w-3.5 h-3.5 text-[#7D9565]" />
                Rootkind Heritage &amp; Nursery — Bengaluru
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#153F2D] leading-[1.15] tracking-tight">
                Reconnecting Indian homes <br className="hidden sm:inline" />
                with the living earth.
              </h1>
              <p className="text-base sm:text-lg text-[#5A5E53] leading-relaxed max-w-2xl mx-auto font-normal">
                We believe that growing food at home is one of the most rewarding acts of everyday mindfulness.
                From compact apartment balconies to sunlit terraces, our botanical goods ensure your first seed becomes your first delicious harvest.
              </p>
            </div>

            {/* 2. HERO FEATURE PHOTOGRAPHY: BALCONY SANCTUARY */}
            <div className="relative rounded-2xl overflow-hidden border border-[#DCD5C1] shadow-xl bg-[#EDE7D8] group">
              <div className="relative aspect-16/9 w-full">
                <Image
                  src="/images/about/balcony-sanctuary.jpg"
                  alt="Sunlit Indian apartment balcony garden with terracotta pots growing heirloom tomatoes, basil, mint, and a brass watering can"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white p-4 sm:p-5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-serif text-sm sm:text-base font-semibold text-[#F7F4EA]">
                      The Urban Balcony Sanctuary — Indiranagar, Bengaluru
                    </p>
                    <p className="text-xs text-white/80 mt-0.5">
                      Grown entirely with Rootkind non-GMO heirloom seeds, living organic soil, and aerated planters.
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-[#7D9565] bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    Spring Trial 2026
                  </span>
                </div>
              </div>
            </div>

            {/* 3. STORY SECTION 1: THE SEED REVOLUTION */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-center">
              <div className="md:col-span-6 relative aspect-4/3 rounded-2xl overflow-hidden border border-[#DCD5C1] shadow-md bg-[#EDE7D8] group">
                <Image
                  src="/images/about/heirloom-seeds.jpg"
                  alt="Hands of a botanist carefully sorting diverse non-GMO heirloom seeds into a kraft paper envelope on a wooden potting bench"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              <div className="md:col-span-6 space-y-4 text-xs sm:text-sm text-[#5A5E53] leading-relaxed">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565]">
                  Our Seed Philosophy
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#153F2D] leading-snug">
                  Saving Flavor and Genetic Diversity, One Seed at a Time
                </h2>
                <p>
                  Most commercial seed packets sold in garden centers are bred for industrial monoculture—prioritizing mechanical harvest and extended supermarket shelf life over true aroma, nutritional density, and home container adaptability.
                </p>
                <p>
                  Rootkind was founded to preserve authentic heirloom lineages. We partner directly with organic seed keepers across Karnataka, Maharashtra, and Himachal Pradesh to preserve open-pollinated seeds that have naturally adapted over generations to thrive in warm balconies and variable Indian weather.
                </p>
                <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-[#153F2D]">
                  <span className="flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-[#C87855]" />
                    Full Sun Tolerance
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#7D9565]" />
                    85%+ Verified Germination
                  </span>
                </div>
              </div>
            </div>

            {/* 4. STORY SECTION 2: LIVING SOILS, NEVER PEAT MOSS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-center">
              <div className="md:col-span-6 order-2 md:order-1 space-y-4 text-xs sm:text-sm text-[#5A5E53] leading-relaxed">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565]">
                  Microbial Soil Health
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#153F2D] leading-snug">
                  Living Organic Earth, Zero Peat Moss
                </h2>
                <p>
                  Plants do not feed directly on synthetic chemical salts; they feed on the rich symbiotic relationships between roots, beneficial mycorrhizal fungi, and organic humus.
                </p>
                <p>
                  Unlike mass-market potting soils that strip ancient carbon-storing peat bogs, our living potting mixes are formulated with washed coconut coir, double-sieved organic vermicompost, neem seed meal, and active endo-mycorrhizae. The result is a featherlight, highly aerated growing medium that never compacts in containers.
                </p>
                <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-[#153F2D]">
                  <span className="flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-[#7D9565]" />
                    100% Peat-Free Formula
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-[#153F2D]" />
                    Optimal Water Retention
                  </span>
                </div>
              </div>

              <div className="md:col-span-6 order-1 md:order-2 relative aspect-4/3 rounded-2xl overflow-hidden border border-[#DCD5C1] shadow-md bg-[#EDE7D8] group">
                <Image
                  src="/images/about/living-soil.jpg"
                  alt="Cupped hands holding rich dark organic living potting mix with emerging healthy green seedlings"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>
            </div>

            {/* 5. THE HARVEST PROMISE: HARVEST BASKET SHOWCASE */}
            <div className="relative rounded-2xl overflow-hidden border border-[#DCD5C1] shadow-xl bg-[#EDE7D8] group">
              <div className="relative aspect-16/9 w-full">
                <Image
                  src="/images/about/harvest-basket.jpg"
                  alt="Handwoven wicker harvest basket overflowing with fresh homegrown tomatoes, emerald okra, radishes, and mint in warm evening light"
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 text-white max-w-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7D9565] mb-2 block">
                    The Harvest Promise
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                    From your first seed to your first fresh harvest.
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                    There is no taste in the world quite like a sun-ripened Desi Pusa Ruby tomato or tender Indian bhindi plucked directly from your balcony thirty seconds before dinner.
                  </p>
                </div>
              </div>
            </div>

            {/* 6. THE 4 BOTANICAL COMMITMENTS */}
            <div className="bg-white rounded-2xl border border-[#DCD5C1] p-6 sm:p-12 shadow-sm space-y-8">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7D9565]">
                  Our Standards
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#153F2D] mt-1">
                  Our Botanical Commitments
                </h2>
                <p className="text-xs sm:text-sm text-[#5A5E53] mt-2">
                  Every product bearing the Rootkind name adheres to our four core quality pillars.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs sm:text-sm">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#153F2D] text-[#7D9565] flex items-center justify-center shrink-0">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#153F2D] mb-1">
                      100% Non-GMO &amp; Open Pollinated
                    </h3>
                    <p className="text-[#5A5E53] leading-relaxed">
                      You can save seeds from your own harvest and replant them next season. We never touch genetically modified or terminator seed lines.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#7D9565]/20 text-[#7D9565] flex items-center justify-center shrink-0">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#153F2D] mb-1">
                      Living Soil, Zero Peat Moss
                    </h3>
                    <p className="text-[#5A5E53] leading-relaxed">
                      We never harvest ancient carbon-storing peat bogs. Our potting mixes utilize washed coconut coir, aged vermicompost, and beneficial mycorrhizae.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C87855]/20 text-[#C87855] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#153F2D] mb-1">
                      Guaranteed Germination Support
                    </h3>
                    <p className="text-[#5A5E53] leading-relaxed">
                      Growing for the first time can feel uncertain. If your seeds fail to sprout with our guide, we send replacement packets free of charge.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#153F2D]/10 text-[#153F2D] flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 text-[#C87855]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#153F2D] mb-1">
                      Plastic-Free Deliveries
                    </h3>
                    <p className="text-[#5A5E53] leading-relaxed">
                      All parcels leave our nursery in 100% recyclable, compostable paper and corrugated cardboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. BOTTOM CALL TO ACTION */}
            <div className="text-center pt-4 sm:pt-8 space-y-4">
              <h2 className="font-serif text-3xl font-bold text-[#153F2D]">
                Ready to plant your first seed?
              </h2>
              <p className="text-sm text-[#5A5E53] max-w-md mx-auto">
                Explore our curated collection of heirloom seeds, organic potting soils, and guided balcony kits.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <Button variant="default" size="lg" asChild>
                  <Link href="/shop" className="gap-2">
                    <span>Explore the Catalogue</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/collections/starter-kits">
                    View Beginner Kits
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}
