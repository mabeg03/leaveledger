"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useTransition } from "react";
import { Download, FileText } from "lucide-react";
import { Avatar } from "@/components/shared/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { cancelLeaveRequestAction } from "@/server/actions/leave";
import type { LeaveType, LeaveRequest, User } from "@prisma/client";

type Row = LeaveRequest & {
  user: Pick<User, "id" | "name" | "email">;
  leaveType: LeaveType;
};

export function RequestList({
  requests,
  leaveTypes,
  nextCursor,
  filters,
}: {
  requests: Row[];
  leaveTypes: LeaveType[];
  nextCursor?: string;
  filters: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [busy, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("cursor");
      router.push(`/requests?${params.toString()}`);
    },
    [router, searchParams],
  );

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  function onSearchChange(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setFilter("q", value), 300);
  }

  function cancel(id: string) {
    startTransition(async () => {
      await cancelLeaveRequestAction(id);
      router.refresh();
    });
  }

  const hasFilters = Boolean(filters.q || (filters.status && filters.status !== "ALL"));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-4">
        <Input
          placeholder="Search name or reason…"
          defaultValue={filters.q ?? ""}
          className="max-w-xs"
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Select
          defaultValue={filters.status ?? "ALL"}
          onChange={(e) => setFilter("status", e.target.value)}
        >
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </Select>
        <Select
          defaultValue={filters.leaveTypeId ?? ""}
          onChange={(e) => setFilter("leaveTypeId", e.target.value)}
        >
          <option value="">All types</option>
          {leaveTypes.map((lt) => (
            <option key={lt.id} value={lt.id}>{lt.name}</option>
          ))}
        </Select>
        <Select
          defaultValue={filters.sort ?? "newest"}
          onChange={(e) => setFilter("sort", e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="startDate">Start date</option>
        </Select>
        <a href="/api/export/requests" className="ml-auto">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </a>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={hasFilters ? "No matching requests" : "No requests yet"}
          description={
            hasFilters
              ? "Try clearing a filter or broadening your search."
              : "Submit your first time-off request to get started."
          }
          action={hasFilters ? undefined : { label: "New request", href: "/requests/new" }}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-background/60 text-muted">
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Days</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr
                  key={req.id}
                  className="border-b border-border/60 transition-colors last:border-0 hover:bg-background/40"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={req.user.name} className="h-8 w-8 text-[10px]" />
                      <span className="font-medium">{req.user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{req.leaveType.name}</td>
                  <td className="px-4 py-3 text-muted">
                    {formatDate(req.startDate)} – {formatDate(req.endDate)}
                  </td>
                  <td className="px-4 py-3">{req.days}</td>
                  <td className="px-4 py-3">
                    <Badge status={req.status}>{req.status.toLowerCase()}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {req.status === "PENDING" && (
                      <Button variant="ghost" size="sm" disabled={busy} onClick={() => cancel(req.id)}>
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {nextCursor && (
        <Button
          variant="outline"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("cursor", nextCursor);
            router.push(`/requests?${params.toString()}`);
          }}
        >
          Load more
        </Button>
      )}
    </div>
  );
}
