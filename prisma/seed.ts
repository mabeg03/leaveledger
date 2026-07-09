import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 12);

  const leaveTypes = await Promise.all([
    prisma.leaveType.upsert({
      where: { name: "Vacation" },
      update: {},
      create: { name: "Vacation", color: "#3b82f6", description: "Annual paid time off" },
    }),
    prisma.leaveType.upsert({
      where: { name: "Sick" },
      update: {},
      create: { name: "Sick", color: "#ef4444", description: "Sick leave" },
    }),
    prisma.leaveType.upsert({
      where: { name: "Personal" },
      update: {},
      create: { name: "Personal", color: "#8b5cf6", description: "Personal days" },
    }),
  ]);

  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      email: "admin@demo.com",
      name: "Alex Admin",
      passwordHash,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@demo.com" },
    update: {},
    create: {
      email: "manager@demo.com",
      name: "Morgan Manager",
      passwordHash,
      role: "MANAGER",
      emailVerified: new Date(),
    },
  });

  const employee = await prisma.user.upsert({
    where: { email: "demo@demo.com" },
    update: { managerId: manager.id },
    create: {
      email: "demo@demo.com",
      name: "Jamie Employee",
      passwordHash,
      role: "EMPLOYEE",
      managerId: manager.id,
      emailVerified: new Date(),
    },
  });

  const users = [admin, manager, employee];
  const balanceDefaults: Record<string, number> = {
    Vacation: 20,
    Sick: 10,
    Personal: 5,
  };

  for (const user of users) {
    for (const lt of leaveTypes) {
      await prisma.leaveBalance.upsert({
        where: {
          userId_leaveTypeId: { userId: user.id, leaveTypeId: lt.id },
        },
        update: {},
        create: {
          userId: user.id,
          leaveTypeId: lt.id,
          totalDays: balanceDefaults[lt.name] ?? 10,
          usedDays: user.email === "demo@demo.com" && lt.name === "Vacation" ? 3 : 0,
        },
      });
    }
  }

  const vacationType = leaveTypes.find((lt) => lt.name === "Vacation")!;
  const sickType = leaveTypes.find((lt) => lt.name === "Sick")!;

  await prisma.leaveRequest.deleteMany({});

  await prisma.leaveRequest.createMany({
    data: [
      {
        userId: employee.id,
        leaveTypeId: vacationType.id,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        days: 3,
        reason: "Family trip",
        status: "PENDING",
      },
      {
        userId: employee.id,
        leaveTypeId: sickType.id,
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
        days: 1,
        reason: "Doctor appointment",
        status: "APPROVED",
        reviewerId: manager.id,
      },
    ],
  });

  console.log("Seed complete!");
  console.log("Demo logins (password: demo1234):");
  console.log("  admin@demo.com   — Admin");
  console.log("  manager@demo.com — Manager");
  console.log("  demo@demo.com    — Employee");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
