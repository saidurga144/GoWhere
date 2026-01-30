import { cn } from "@/lib/utils";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

// Advanced button with gradient and multiple variants
const advancedButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus-visible:ring-indigo-500",
        secondary:
          "bg-slate-200 text-slate-900 hover:bg-slate-300 active:bg-slate-400 focus-visible:ring-slate-400",
        ghost:
          "bg-transparent text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 border border-indigo-200 focus-visible:ring-indigo-500",
        gradient:
          "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 focus-visible:ring-indigo-500",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 px-3 py-1 text-xs",
        lg: "h-12 px-6 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface AdvancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof advancedButtonVariants> {}

const AdvancedButton = React.forwardRef<
  HTMLButtonElement,
  AdvancedButtonProps
>(({ className, variant, size, ...props }, ref) => (
  <button
    className={cn(advancedButtonVariants({ variant, size, className }))}
    ref={ref}
    {...props}
  />
));
AdvancedButton.displayName = "AdvancedButton";

export { AdvancedButton };
