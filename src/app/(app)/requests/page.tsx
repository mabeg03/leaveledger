import { auth } from "@/lib/auth";
import { getLeaveRequests, getLeaveTypes } from "@/server/queries/leave";
import { PageHeader } from "@/components/shared/page-header";
import { RequestList } from "@/components/requests/request-list";
import { ButtonLink } from "@/components/ui/button";

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await auth();
  const params = await searchParams;
  const filters = {
    q: params.q,
    status: (params.status as "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "ALL") ?? "ALL",
    leaveTypeId: params.leaveTypeId,
    sort: (params.sort as "newest" | "oldest" | "startDate") ?? "newest",
    cursor: params.cursor,
  };

  const [{ items, nextCursor }, leaveTypes] = await Promise.all([
    getLeaveRequests(session!.user.id, session!.user.role, filters),
    getLeaveTypes(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Requests"
        description="All time-off requests you can see"
        action={
          <ButtonLink href="/requests/new">New request</ButtonLink>
        }
      />
      <RequestList requests={items} leaveTypes={leaveTypes} nextCursor={nextCursor} filters={filters} />
    </div>
  );
}
