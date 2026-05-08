import { Loader2 } from "lucide-react";

export function Spinner({ size = 24, color = "#6366f1" }) {
  return (
    <Loader2
      size={size}
      color={color}
      style={{ animation: "spin 1s linear infinite", display: "block" }}
    />
  );
}
