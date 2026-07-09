"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/auth";
import { createAuditLog } from "@/server/audit";
import { calculateBusinessDays } from "@/lib/utils";
import {
  leaveRequestSchema,
  reviewSchema,
  signupSchema,
} from "@/lib/validators/auth";
import type { LeaveStatus } from "@prisma/client";

type Result<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

function fail(message: string): Result<never> {
  return { success: false, error: message };
}

function fieldError(parsed: { success: false; error: { issues: { message: string }[] } }) {
  return fail(parsed.error.issues[0]?.message ?? "Invalid input");
}

export async function signupAction(input: unknown): Promise<Result<{ email: string }>> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) return fieldError(parsed);

  const existing = await db.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) return fail("An account with this email already exists");

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const leaveTypes = await db.leaveType.findMany();

  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: "EMPLOYEE",
      emailVerified: new Date(),
      leaveBalances: {
        create: leaveTypes.map((lt) => ({
          leaveTypeId: lt.id,
          totalDays: lt.name === "Vacation" ? 20 : lt.name === "Sick" ? 10 : 5,
          usedDays: 0,
        })),
      },
    },
  });

  await createAuditLog({
    userId: user.id,
    action: "USER_SIGNUP",
    entityType: "User",
    entityId: user.id,
  });

  return { success: true, data: { email: user.email } };
}

export async function createLeaveRequestAction(input: unknown): Promise<Result<{ id: string }>> {
  const user = await requireAuth();
  const parsed = leaveRequestSchema.safeParse(input);
  if (!parsed.success) return fieldError(parsed);

  const startDate = new Date(parsed.data.startDate);
  const endDate = new Date(parsed.data.endDate);
  const days = calculateBusinessDays(startDate, endDate);

  const balance = await db.leaveBalance.findUnique({
    where: {
      userId_leaveTypeId: {
        userId: user.id,
        leaveTypeId: parsed.data.leaveTypeId,
      },
    },
  });

  if (!balance) return fail("No balance found for that leave type");

  const remaining = balance.totalDays - balance.usedDays;
  if (days > remaining) {
    return fail(`Only ${remaining} day${remaining === 1 ? "" : "s"} left on this balance`);
  }

  const request = await db.leaveRequest.create({
    data: {
      userId: user.id,
      leaveTypeId: parsed.data.leaveTypeId,
      startDate,
      endDate,
      days,
      reason: parsed.data.reason,
      status: "PENDING",
    },
  });

  await createAuditLog({
    userId: user.id,
    action: "LEAVE_REQUEST_CREATED",
    entityType: "LeaveRequest",
    entityId: request.id,
    metadata: { days, leaveTypeId: parsed.data.leaveTypeId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/requests");
  revalidatePath("/approvals");
  revalidatePath("/calendar");

  return { success: true, data: { id: request.id } };
}

export async function cancelLeaveRequestAction(requestId: string): Promise<Result> {
  const user = await requireAuth();

  const request = await db.leaveRequest.findFirst({
    where: { id: requestId, userId: user.id, deletedAt: null },
  });

  if (!request) return fail("Request not found");
  if (request.status !== "PENDING") return fail("Only pending requests can be cancelled");

  await db.leaveRequest.update({
    where: { id: requestId },
    data: { status: "CANCELLED" },
  });

  await createAuditLog({
    userId: user.id,
    action: "LEAVE_REQUEST_CANCELLED",
    entityType: "LeaveRequest",
    entityId: requestId,
  });

  revalidatePath("/dashboard");
  revalidatePath("/requests");

  return { success: true, data: undefined };
}

export async function reviewLeaveRequestAction(input: unknown): Promise<Result> {
  const reviewer = await requireRole("ADMIN", "MANAGER");
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return fieldError(parsed);

  const request = await db.leaveRequest.findFirst({
    where: { id: parsed.data.requestId, deletedAt: null, status: "PENDING" },
    include: { user: true },
  });

  if (!request) return fail("Pending request not found");

  if (reviewer.role === "MANAGER") {
    const isReport = await db.user.findFirst({
      where: { id: request.userId, managerId: reviewer.id },
    });
    if (!isReport) return fail("You can only review your direct reports");
  }

  const newStatus: LeaveStatus =
    parsed.data.action === "approve" ? "APPROVED" : "REJECTED";

  await db.$transaction(async (tx) => {
    await tx.leaveRequest.update({
      where: { id: request.id },
      data: {
        status: newStatus,
        reviewerId: reviewer.id,
        reviewNote: parsed.data.reviewNote,
      },
    });

    if (newStatus === "APPROVED") {
      await tx.leaveBalance.update({
        where: {
          userId_leaveTypeId: {
            userId: request.userId,
            leaveTypeId: request.leaveTypeId,
          },
        },
        data: { usedDays: { increment: request.days } },
      });
    }
  });

  await createAuditLog({
    userId: reviewer.id,
    action: `LEAVE_REQUEST_${newStatus}`,
    entityType: "LeaveRequest",
    entityId: request.id,
    metadata: { reviewNote: parsed.data.reviewNote },
  });

  revalidatePath("/dashboard");
  revalidatePath("/approvals");
  revalidatePath("/requests");
  revalidatePath("/calendar");

  return { success: true, data: undefined };
}
