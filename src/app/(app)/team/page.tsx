import { getTeamMembers, getAuditLogs } from "@/server/queries/leave";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar } from "@/components/shared/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TeamPage() {
  const [members, logs] = await Promise.all([getTeamMembers(), getAuditLogs(20)]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader title="Team" description={`${members.length} people on LeaveLedger`} />

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-background/60 text-muted">
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Manager</th>
              <th className="px-4 py-3 font-medium">Vacation</th>
              <th className="px-4 py-3 font-medium">Requests</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const vacation = m.leaveBalances.find((b) => b.leaveType.name === "Vacation");
              const left = vacation ? vacation.totalDays - vacation.usedDays : null;
              return (
                <tr key={m.id} className="border-b border-border/60 last:border-0 hover:bg-background/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={m.name} className="h-8 w-8 text-[10px]" />
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-muted">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted">{m.role.toLowerCase()}</td>
                  <td className="px-4 py-3 text-muted">{m.manager?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    {left !== null ? `${left} / ${vacation!.totalDays}` : "—"}
                  </td>
                  <td className="px-4 py-3">{m._count.leaveRequests}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity log</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {logs.map((log) => (
              <li key={log.id} className="flex justify-between gap-4 py-3 text-sm first:pt-0 last:pb-0">
                <span>
                  <span className="font-medium">{log.user.name}</span>
                  <span className="text-muted"> · {humanize(log.action)}</span>
                </span>
                <time className="shrink-0 text-xs text-muted">
                  {new Date(log.createdAt).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function humanize(action: string) {
  return action.replace(/_/g, " ").toLowerCase();
}
