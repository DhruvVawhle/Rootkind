import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "terracotta" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, asChild = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none cursor-pointer";

    const variantStyles = {
      default:
        "bg-[#153F2D] text-[#F7F4EA] hover:bg-[#1C523B] shadow-sm",
      secondary:
        "bg-[#EDE7D8] text-[#153F2D] hover:bg-[#E2D9C4]",
      outline:
        "border border-[#DCD5C1] bg-transparent text-[#282B25] hover:bg-[#EDE7D8] hover:text-[#153F2D]",
      ghost:
        "text-[#282B25] hover:bg-[#EDE7D8] hover:text-[#153F2D]",
      terracotta:
        "bg-[#9A4F2E] text-[#F7F4EA] hover:bg-[#834023] shadow-sm",
      destructive:
        "bg-[#B83A2E] text-white hover:bg-[#9B2F25] shadow-sm",
    };

    const sizeStyles = {
      default: "h-10 px-5 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-md px-7 text-base font-semibold",
      icon: "h-10 w-10 p-0",
    };

    const combinedClassName = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string; disabled?: boolean; children?: React.ReactNode }>;
      return React.cloneElement(child, {
        ...props,
        className: cn(combinedClassName, child.props.className),
        children: (
          <>
            {isLoading && (
              <svg
                className="mr-2 h-4 w-4 animate-spin text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {child.props.children}
          </>
        ),
      });
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClassName}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
