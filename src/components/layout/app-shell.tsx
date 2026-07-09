"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { navForRole } from "@/config/nav";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/shared/avatar";
import { CommandMenu } from "@/components/layout/command-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import type { Role } from "@prisma/client";

function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
        L
      </span>
      <span className="font-semibold text-sidebar-active">LeaveLedger</span>
    </Link>
  );
}

function SidebarNav({
  role,
  pathname,
  onNavigate,
}: {
  role: Role;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-0.5">
      {navForRole(role).map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-white/10 text-sidebar-active"
                : "text-sidebar-text hover:bg-white/5 hover:text-sidebar-active",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string; role: Role };
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <CommandMenu role={user.role} />

      <aside className="hidden w-60 shrink-0 flex-col bg-[var(--sidebar)] px-4 py-5 lg:flex">
        <Logo />
        <p className="mt-1 px-1 text-xs text-sidebar-text">Time off, simplified</p>
        <div className="mt-8 flex-1">
          <SidebarNav role={user.role} pathname={pathname} />
        </div>
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 px-1">
            <Avatar name={user.name} className="bg-brand/20 text-brand" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-active">{user.name}</p>
              <p className="truncate text-xs capitalize text-sidebar-text">{user.role.toLowerCase()}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full justify-start text-sidebar-text hover:bg-white/5 hover:text-sidebar-active"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-64 flex-col bg-[var(--sidebar)] px-4 py-5">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close">
                <X className="h-5 w-5 text-sidebar-active" />
              </button>
            </div>
            <SidebarNav
              role={user.role}
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-md lg:px-8">
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="hidden items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-muted lg:flex"
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          >
            <Search className="h-3.5 w-3.5" />
            Search
            <kbd className="ml-6 rounded border border-border px-1 text-xs">⌘K</kbd>
          </button>
          <div className="flex-1" />
          <ThemeToggle />
          <span className="hidden text-sm text-muted md:block">{user.email}</span>
        </header>
        <main className="dot-grid flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
