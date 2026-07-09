import type { Role } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  PlusCircle,
  Users,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Role[];
  shortcut?: string;
};

export const mainNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { href: "/requests", label: "Requests", icon: ClipboardCheck, roles: ["ADMIN", "MANAGER", "EMPLOYEE"], shortcut: "R" },
  { href: "/requests/new", label: "New request", icon: PlusCircle, roles: ["ADMIN", "MANAGER", "EMPLOYEE"], shortcut: "N" },
  { href: "/approvals", label: "Approvals", icon: ClipboardCheck, roles: ["ADMIN", "MANAGER"] },
  { href: "/calendar", label: "Calendar", icon: CalendarDays, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
  { href: "/team", label: "Team", icon: Users, roles: ["ADMIN"] },
];

export function navForRole(role: Role) {
  return mainNav.filter((item) => item.roles.includes(role));
}
