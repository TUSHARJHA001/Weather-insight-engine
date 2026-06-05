import { Cloud } from "lucide-react";

export default function EmptyState({
  icon: Icon = Cloud,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent-muted border border-[var(--border-subtle)] flex items-center justify-center">
        <Icon size={22} className="text-[var(--accent-primary)] opacity-60" />
      </div>
      {title && <p className="text-text-primary font-medium">{title}</p>}
      {description && (
        <p className="text-text-muted text-sm max-w-xs">{description}</p>
      )}
      {action}
    </div>
  );
}
