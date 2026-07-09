import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const leaveRequestSchema = z
  .object({
    leaveTypeId: z.string().min(1, "Select a leave type"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z.string().max(500).optional(),
  })
  .refine(
    (data) => new Date(data.endDate) >= new Date(data.startDate),
    { message: "End date must be on or after start date", path: ["endDate"] },
  );

export const reviewSchema = z.object({
  requestId: z.string().min(1),
  action: z.enum(["approve", "reject"]),
  reviewNote: z.string().max(500).optional(),
});

export const requestFiltersSchema = z.object({
  q: z.string().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED", "ALL"]).optional(),
  leaveTypeId: z.string().optional(),
  sort: z.enum(["newest", "oldest", "startDate"]).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type RequestFilters = z.infer<typeof requestFiltersSchema>;
