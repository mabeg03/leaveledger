import { cn } from "@/lib/utils";

type BalanceCardProps = {
  label: string;
  remaining: number;
  total: number;
  accent?: string;
};

export function BalanceCard({ label, remaining, total, accent = "#0d9488" }: BalanceCardProps) {
  const used = total - remaining;
  const pct = total > 0 ? Math.round((used / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">
        {remaining}
        <span className="text-base font-normal text-muted"> / {total} days</span>
      </p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: accent }}
        />
      </div>
      <p className="mt-2 text-xs text-muted">{used} day{used === 1 ? "" : "s"} used</p>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border bg-surface p-5 shadow-sm", className)}>
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-2 text-sm text-brand">{hint}</p>}
    </div>
  );
}
