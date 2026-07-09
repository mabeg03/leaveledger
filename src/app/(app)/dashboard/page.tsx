import Link from "next/link";
import { auth } from "@/lib/auth";
import { getDashboardStats } from "@/server/queries/leave";
import { PageHeader } from "@/components/shared/page-header";
import { BalanceCard, StatCard } from "@/components/shared/balance-card";
import { Avatar } from "@/components/shared/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const user = session!.user;
  const stats = await getDashboardStats(user.id, user.role);
  const isManager = user.role === "ADMIN" || user.role === "MANAGER";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        title={`Good ${getGreeting()}, ${user.name.split(" ")[0]}`}
        description="Here's what's happening with your time off."
        action={
          <Link href="/requests/new">
            <Button>New request</Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.balances.map((b) => (
          <BalanceCard
            key={b.id}
            label={b.leaveType.name}
            remaining={b.totalDays - b.usedDays}
            total={b.totalDays}
            accent={b.leaveType.color}
          />
        ))}
        {isManager && (
          <Link href="/approvals" className={stats.pendingApprovals === 0 ? "pointer-events-none" : undefined}>
            <StatCard
              label="Awaiting your review"
              value={stats.pendingApprovals}
              hint={stats.pendingApprovals > 0 ? "Tap to review" : undefined}
              className={stats.pendingApprovals > 0 ? "ring-1 ring-brand/20 transition-shadow hover:shadow-md" : undefined}
            />
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-semibold">{stats.myPending}</p>
                <p className="text-sm text-muted">Pending</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.myApproved}</p>
                <p className="text-sm text-muted">Approved</p>
              </div>
            </div>
            {isManager && stats.pendingApprovals > 0 && (
              <Link href="/approvals" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
                Review {stats.pendingApprovals} pending →
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming absences</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.upcoming.length === 0 ? (
              <p className="text-sm text-muted">Nothing scheduled yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {stats.upcoming.map((req) => (
                  <li key={req.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <Avatar name={req.user.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{req.user.name}</p>
                      <p className="text-xs text-muted">
                        {formatDate(req.startDate)} – {formatDate(req.endDate)}
                      </p>
                    </div>
                    <Badge>{req.leaveType.name}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
