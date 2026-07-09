import { describe, expect, it } from "vitest";
import { calculateBusinessDays } from "@/lib/utils";

describe("calculateBusinessDays", () => {
  it("counts weekdays only", () => {
    const start = new Date("2026-07-06");
    const end = new Date("2026-07-10");
    expect(calculateBusinessDays(start, end)).toBe(5);
  });

  it("returns at least 1 for same day", () => {
    const d = new Date("2026-07-09");
    expect(calculateBusinessDays(d, d)).toBe(1);
  });

  it("excludes weekends", () => {
    const start = new Date("2026-07-11");
    const end = new Date("2026-07-12");
    expect(calculateBusinessDays(start, end)).toBe(1);
  });
});
