import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowRight, Sparkles } from "lucide-react";

export function AnnouncementBar() {
  if (!siteConfig.announcement.enabled) return null;

  return (
    <aside
      aria-label="Store announcement"
      className="bg-[#153F2D] text-[#F7F4EA] px-4 py-2 text-xs font-medium tracking-wide flex items-center justify-center transition-colors"
    >
      <div className="flex items-center gap-2 max-w-7xl mx-auto text-center flex-wrap justify-center">
        <Sparkles className="w-3.5 h-3.5 text-[#7D9565] shrink-0" aria-hidden="true" />
        <span>{siteConfig.announcement.text}</span>
        {siteConfig.announcement.linkText && (
          <Link
            href={siteConfig.announcement.href}
            className="inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:text-[#EDE7D8] transition-colors ml-1"
          >
            {siteConfig.announcement.linkText}
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        )}
      </div>
    </aside>
  );
}
