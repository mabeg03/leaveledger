import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <p className="text-6xl font-semibold text-brand">404</p>
      <h1 className="text-xl font-medium">Page not found</h1>
      <p className="text-sm text-muted">That route doesn&apos;t exist or was moved.</p>
      <Link href="/">
        <Button>Back home</Button>
      </Link>
    </div>
  );
}
