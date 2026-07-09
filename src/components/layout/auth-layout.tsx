import Link from "next/link";
import type { ReactNode } from "react";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-[var(--sidebar)] p-12 text-sidebar-active lg:flex">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
            L
          </span>
          <span className="text-lg font-semibold">LeaveLedger</span>
        </div>
        <div>
          <h2 className="text-3xl font-semibold leading-snug">
            Your team&apos;s time off,
            <br />
            finally organized.
          </h2>
          <p className="mt-4 max-w-md text-sidebar-text">
            Request leave, get approvals, and see who&apos;s out — all in one place.
          </p>
        </div>
        <p className="text-sm text-sidebar-text">demo@demo.com · demo1234</p>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
                L
              </span>
              <span className="font-semibold">LeaveLedger</span>
            </Link>
          </div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-muted">{footer}</div>
        </div>
      </div>
    </div>
  );
}
