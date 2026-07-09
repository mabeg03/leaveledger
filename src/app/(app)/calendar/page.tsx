import { CalendarDays } from "lucide-react";
import { getCalendarEvents } from "@/server/queries/leave";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar } from "@/components/shared/avatar";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = params.month ? parseInt(params.month, 10) - 1 : now.getMonth();
  const year = params.year ? parseInt(params.year, 10) : now.getFullYear();
  const viewDate = new Date(year, month, 1);
  const events = await getCalendarEvents(viewDate);
  const label = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const prevMonth = month === 0 ? 12 : month;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 1 : month + 2;
  const nextYear = month === 11 ? year + 1 : year;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Team calendar"
        description={`Approved leave in ${label}`}
        action={
          <div className="flex gap-2">
            <a href={`/calendar?month=${prevMonth}&year=${prevYear}`}>
              <Button variant="outline" size="sm">Previous</Button>
            </a>
            <a href={`/calendar?month=${nextMonth}&year=${nextYear}`}>
              <Button variant="outline" size="sm">Next</Button>
            </a>
          </div>
        }
      />

      {events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Clear calendar"
          description="Nobody's out this month — or nothing's been approved yet."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <Avatar name={event.user.name} />
                <div>
                  <p className="font-medium">{event.user.name}</p>
                  <span
                    className="mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: event.leaveType.color }}
                  >
                    {event.leaveType.name}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted">
                {formatDate(event.startDate)} – {formatDate(event.endDate)}
              </p>
              <p className="text-xs text-muted">{event.days} business days</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
