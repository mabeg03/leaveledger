"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function loginErrorMessage(error: string | null) {
  if (!error) return null;
  if (error === "CredentialsSignin" || error === "invalid") {
    return "Invalid email or password";
  }
  return "Sign in failed. Please try again.";
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const error = loginErrorMessage(searchParams.get("error"));
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/csrf")
      .then((res) => res.json())
      .then((data: { csrfToken: string }) => {
        if (!cancelled) setCsrfToken(data.csrfToken);
      })
      .catch(() => {
        if (!cancelled) setCsrfToken("");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account"
      footer={
        <>
          No account?{" "}
          <Link href="/signup" className="font-medium text-brand hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      {csrfToken === null ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : csrfToken === "" ? (
        <p className="text-sm text-red-600" role="alert">
          Could not start sign-in. Refresh the page and try again.
        </p>
      ) : (
        <form
          action="/api/auth/callback/credentials"
          method="POST"
          className="space-y-4"
        >
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue="demo@demo.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              defaultValue="demo1234"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
