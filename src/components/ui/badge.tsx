import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "terracotta" | "forest" | "sage";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-[#153F2D] text-[#F7F4EA]",
    secondary: "border-transparent bg-[#EDE7D8] text-[#153F2D]",
    outline: "border-[#DCD5C1] text-[#282B25]",
    terracotta: "border-transparent bg-[#9A4F2E] text-[#F7F4EA]",
    forest: "border-transparent bg-[#153F2D]/10 text-[#153F2D]",
    sage: "border-transparent bg-[#7D9565]/15 text-[#3E552E]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
