import { getLeaveTypes } from "@/server/queries/leave";
import { PageHeader } from "@/components/shared/page-header";
import { NewRequestForm } from "@/components/requests/new-request-form";

export default async function NewRequestPage() {
  const leaveTypes = await getLeaveTypes();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader title="New request" description="Submit time off for manager approval" />
      <NewRequestForm leaveTypes={leaveTypes} />
    </div>
  );
}
