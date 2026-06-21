import * as React from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
}

function Separator({ className, orientation = "horizontal", ...props }: SeparatorProps) {
  return (
    <hr
      className={cn(
        "shrink-0 border-border",
        orientation === "horizontal" ? "h-px w-full border-t" : "h-full w-px border-l",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
