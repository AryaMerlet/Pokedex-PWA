import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none border-4 border-foreground font-pixel uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[4px_4px_0_0] shadow-foreground hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        destructive:
          "bg-pixel-red text-white shadow-[4px_4px_0_0] shadow-foreground hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        outline:
          "border-4 border-foreground bg-background shadow-[4px_4px_0_0] shadow-foreground hover:bg-muted hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[4px_4px_0_0] shadow-foreground hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        ghost:
          "border-transparent shadow-none hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline border-transparent shadow-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 gap-1.5 px-3 text-[10px]",
        lg: "h-12 px-8 text-sm",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
