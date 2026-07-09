"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Inbox } from "lucide-react";
import { Avatar } from "@/components/shared/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { reviewLeaveRequestAction } from "@/server/actions/leave";
import type { LeaveRequest, LeaveType, User } from "@prisma/client";

type Pending = LeaveRequest & {
  user: Pick<User, "id" | "name" | "email">;
  leaveType: LeaveType;
};

export function ApprovalQueue({ requests }: { requests: Pending[] }) {
  const router = useRouter();
  const [busy, startTransition] = useTransition();
  const [notes, setNotes] = useState<Record<string, string>>({});

  function review(requestId: string, action: "approve" | "reject") {
    startTransition(async () => {
      await reviewLeaveRequestAction({ requestId, action, reviewNote: notes[requestId] });
      router.refresh();
    });
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Inbox zero"
        description="No pending requests right now. Check back later or grab a coffee."
      />
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <Card key={req.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <Avatar name={req.user.name} />
                <div>
                  <p className="font-semibold">{req.user.name}</p>
                  <p className="text-sm text-muted">{req.user.email}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge status="PENDING">{req.leaveType.name}</Badge>
                    <span className="text-sm text-muted">
                      {formatDate(req.startDate)} – {formatDate(req.endDate)} · {req.days} days
                    </span>
                  </div>
                  {req.reason && (
                    <p className="mt-3 text-sm text-muted">
                      <span className="font-medium text-foreground">Reason:</span> {req.reason}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-border bg-background/40 p-4">
              <Textarea
                placeholder="Add a note (optional)"
                rows={2}
                value={notes[req.id] ?? ""}
                onChange={(e) => setNotes((n) => ({ ...n, [req.id]: e.target.value }))}
              />
              <div className="mt-3 flex gap-2">
                <Button disabled={busy} onClick={() => review(req.id, "approve")}>
                  Approve
                </Button>
                <Button variant="outline" disabled={busy} onClick={() => review(req.id, "reject")}>
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
