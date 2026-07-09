import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requests = await db.leaveRequest.findMany({
    where: {
      deletedAt: null,
      ...(session.user.role === "EMPLOYEE" ? { userId: session.user.id } : {}),
    },
    include: { user: true, leaveType: true },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });

  const header = "Employee,Email,Type,Start,End,Days,Status,Reason\n";
  const rows = requests
    .map((r) =>
      [
        r.user.name,
        r.user.email,
        r.leaveType.name,
        r.startDate.toISOString().split("T")[0],
        r.endDate.toISOString().split("T")[0],
        r.days,
        r.status,
        `"${(r.reason ?? "").replace(/"/g, '""')}"`,
      ].join(","),
    )
    .join("\n");

  return new NextResponse(header + rows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="leave-requests.csv"',
    },
  });
}
