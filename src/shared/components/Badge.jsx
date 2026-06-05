import { cn } from "@/shared/utils/index.js";

export default function Badge({ children, color, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        className,
      )}
      style={{
        background: color ? `${color}22` : undefined,
        color: color || undefined,
        border: `1px solid ${color ? `${color}44` : "var(--border-subtle)"}`,
      }}
    >
      {children}
    </span>
  );
}
