import { db } from "@/lib/db";
import type { LeaveStatus, Role } from "@prisma/client";
import type { RequestFilters } from "@/lib/validators/auth";

export async function getDashboardStats(userId: string, role: Role) {
  const balances = await db.leaveBalance.findMany({
    where: { userId },
    include: { leaveType: true },
  });

  const myPending = await db.leaveRequest.count({
    where: { userId, status: "PENDING", deletedAt: null },
  });

  const myApproved = await db.leaveRequest.count({
    where: { userId, status: "APPROVED", deletedAt: null },
  });

  let pendingApprovals = 0;
  if (role === "ADMIN") {
    pendingApprovals = await db.leaveRequest.count({
      where: { status: "PENDING", deletedAt: null },
    });
  } else if (role === "MANAGER") {
    const reportIds = (
      await db.user.findMany({
        where: { managerId: userId, deletedAt: null },
        select: { id: true },
      })
    ).map((u) => u.id);
    pendingApprovals = await db.leaveRequest.count({
      where: {
        userId: { in: reportIds },
        status: "PENDING",
        deletedAt: null,
      },
    });
  }

  const upcoming = await db.leaveRequest.findMany({
    where: {
      status: "APPROVED",
      startDate: { gte: new Date() },
      deletedAt: null,
      ...(role === "EMPLOYEE" ? { userId } : {}),
    },
    include: { user: true, leaveType: true },
    orderBy: { startDate: "asc" },
    take: 5,
  });

  return {
    balances,
    myPending,
    myApproved,
    pendingApprovals,
    upcoming,
  };
}

export async function getLeaveRequests(
  userId: string,
  role: Role,
  filters: RequestFilters,
) {
  const limit = filters.limit ?? 25;
  const status = filters.status === "ALL" ? undefined : filters.status;

  const where: {
    deletedAt: null;
    status?: LeaveStatus;
    leaveTypeId?: string;
    userId?: string | { in: string[] };
    OR?: Array<{ reason?: { contains: string }; user?: { name: { contains: string } } }>;
  } = { deletedAt: null };

  if (status) where.status = status;
  if (filters.leaveTypeId) where.leaveTypeId = filters.leaveTypeId;

  if (role === "EMPLOYEE") {
    where.userId = userId;
  } else if (role === "MANAGER") {
    const reportIds = (
      await db.user.findMany({
        where: { managerId: userId, deletedAt: null },
        select: { id: true },
      })
    ).map((u) => u.id);
    where.userId = { in: [...reportIds, userId] };
  }

  if (filters.q?.trim()) {
    const q = filters.q.trim();
    where.OR = [
      { reason: { contains: q } },
      { user: { name: { contains: q } } },
    ];
  }

  const orderBy =
    filters.sort === "oldest"
      ? [{ createdAt: "asc" as const }, { id: "asc" as const }]
      : filters.sort === "startDate"
        ? [{ startDate: "asc" as const }, { id: "asc" as const }]
        : [{ createdAt: "desc" as const }, { id: "desc" as const }];

  const requests = await db.leaveRequest.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
      leaveType: true,
      reviewer: { select: { name: true } },
    },
    orderBy,
    take: limit + 1,
    ...(filters.cursor
      ? { cursor: { id: filters.cursor }, skip: 1 }
      : {}),
  });

  const hasMore = requests.length > limit;
  const items = hasMore ? requests.slice(0, limit) : requests;
  const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

  return { items, nextCursor, hasMore };
}

export async function getPendingApprovals(userId: string, role: Role) {
  const where: {
    status: "PENDING";
    deletedAt: null;
    userId?: { in: string[] };
  } = { status: "PENDING", deletedAt: null };

  if (role === "MANAGER") {
    const reportIds = (
      await db.user.findMany({
        where: { managerId: userId, deletedAt: null },
        select: { id: true },
      })
    ).map((u) => u.id);
    where.userId = { in: reportIds };
  }

  return db.leaveRequest.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
      leaveType: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getCalendarEvents(month: Date) {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);

  return db.leaveRequest.findMany({
    where: {
      status: "APPROVED",
      deletedAt: null,
      startDate: { lte: end },
      endDate: { gte: start },
    },
    include: {
      user: { select: { id: true, name: true } },
      leaveType: true,
    },
    orderBy: { startDate: "asc" },
  });
}

export async function getLeaveTypes() {
  return db.leaveType.findMany({ orderBy: { name: "asc" } });
}

export async function getTeamMembers() {
  return db.user.findMany({
    where: { deletedAt: null },
    include: {
      manager: { select: { name: true } },
      leaveBalances: { include: { leaveType: true } },
      _count: { select: { leaveRequests: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getAuditLogs(limit = 50) {
  return db.auditLog.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
