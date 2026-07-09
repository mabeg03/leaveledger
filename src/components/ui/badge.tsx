import { cn } from "@/lib/utils";
import type { LeaveStatus } from "@prisma/client";

const styles: Record<LeaveStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  APPROVED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  REJECTED: "bg-red-500/10 text-red-700 dark:text-red-400",
  CANCELLED: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
};

export function Badge({
  status,
  className,
  children,
}: {
  status?: LeaveStatus;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize",
        status ? styles[status] : "bg-brand-muted text-brand",
        className,
      )}
    >
      {children}
    </span>
  );
}
