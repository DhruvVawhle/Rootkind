import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-[#DCD5C1] bg-white px-3.5 py-2 text-sm text-[#282B25] placeholder:text-[#8C9083] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#153F2D] focus-visible:border-[#153F2D] disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-2xs",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
