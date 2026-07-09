import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "LeaveLedger — PTO requests & approvals for small teams",
  description:
    "PTO requests, approvals, and balance tracking for managers. No spreadsheets required.",
};

const perks = [
  {
    icon: CalendarDays,
    title: "Request in seconds",
    desc: "Pick dates, check your balance, submit — done before your coffee gets cold.",
  },
  {
    icon: CheckCircle2,
    title: "One-click approvals",
    desc: "Managers see context upfront. Approve or reject without chasing people on Slack.",
  },
  {
    icon: Users,
    title: "Team visibility",
    desc: "Calendar view shows who's out this week. Plan around absences before they bite you.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
              L
            </span>
            <span className="font-semibold">LeaveLedger</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-60" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
                <Shield className="h-3.5 w-3.5 text-brand" />
                Built for teams of 5–50
              </p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Time off without the spreadsheet chaos
              </h1>
              <p className="mt-5 text-lg text-muted">
                LeaveLedger handles PTO requests, manager approvals, and team calendars —
                so HR isn&apos;t stuck in email threads.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login">
                  <Button size="lg">
                    Try the demo <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="outline">
                    Create account
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted">
                Demo login: <code className="rounded bg-brand-muted px-1.5 py-0.5 text-brand">demo@demo.com</code> / demo1234
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-black/5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium">Your balances</p>
                <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700">
                  1 pending
                </span>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Vacation", left: 17, total: 20, color: "#0d9488" },
                  { label: "Sick", left: 10, total: 10, color: "#ef4444" },
                  { label: "Personal", left: 4, total: 5, color: "#8b5cf6" },
                ].map((b) => (
                  <div key={b.label}>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">{b.label}</span>
                      <span className="font-medium">{b.left} / {b.total} days</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${((b.total - b.left) / b.total) * 100}%`,
                          backgroundColor: b.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-border bg-background p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Upcoming</p>
                <p className="mt-2 text-sm font-medium">Family trip · Jul 16–18</p>
                <p className="text-xs text-muted">3 days · Vacation · Pending approval</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-6 sm:grid-cols-3">
            {perks.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-surface p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-muted">
                  <item.icon className="h-5 w-5 text-brand" />
                </div>
                <h2 className="mt-4 font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <h2 className="text-xl font-semibold">Common questions</h2>
            <dl className="mt-8 space-y-6">
              <div>
                <dt className="font-medium">Who is this for?</dt>
                <dd className="mt-1 text-sm text-muted">
                  Small teams that need a real PTO workflow without paying for enterprise HR software.
                </dd>
              </div>
              <div>
                <dt className="font-medium">Can I try it without signing up?</dt>
                <dd className="mt-1 text-sm text-muted">
                  Yes — use the demo account above to explore as an employee, manager, or admin.
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        Digital Heroes Full Stack Trial · MIT License
      </footer>
    </div>
  );
}
