import { cn } from "@/shared/utils/index.js";

export default function Card({
  children,
  className,
  glass = true,
  glow = false,
  ...props
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 relative overflow-hidden transition-all duration-200",
        glass ? "glass" : "bg-surface-1",
        glow && "glow-primary",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className, mono = false }) {
  return (
    <h3
      className={cn(
        "text-text-muted uppercase tracking-widest text-xs font-semibold",
        mono && "font-mono",
        className,
      )}
    >
      {children}
    </h3>
  );
}
