import { auth } from "@/lib/auth";
import { getPendingApprovals } from "@/server/queries/leave";
import { PageHeader } from "@/components/shared/page-header";
import { ApprovalQueue } from "@/components/approvals/approval-queue";

export default async function ApprovalsPage() {
  const session = await auth();
  const requests = await getPendingApprovals(session!.user.id, session!.user.role);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Approvals"
        description={`${requests.length} request${requests.length === 1 ? "" : "s"} waiting on you`}
      />
      <ApprovalQueue requests={requests} />
    </div>
  );
}
