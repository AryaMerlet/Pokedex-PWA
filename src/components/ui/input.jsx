import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-4 border-foreground h-10 w-full min-w-0 bg-background px-3 py-1 text-xs shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.2)] transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 font-pixel uppercase",
        "focus-visible:shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.3)] focus-visible:bg-muted",
        "aria-invalid:border-destructive",
        className
      )}
      {...props} />
  );
}

export { Input }
