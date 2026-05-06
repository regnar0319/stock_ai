import { cn } from "../../utils";
import { Loader2 } from "lucide-react";

export function Spinner({ className, size = 24 }) {
  return (
    <Loader2
      size={size}
      className={cn("animate-spin text-primary", className)}
    />
  );
}
