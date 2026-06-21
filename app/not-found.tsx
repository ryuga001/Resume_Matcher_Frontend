import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 text-center px-4">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="size-4 text-primary" />
        <span className="font-heading text-sm font-semibold">MatchKit</span>
      </div>
      <div>
        <p className="font-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">404</p>
        <h1 className="font-heading text-2xl font-bold tracking-tight mb-2">Page not found</h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          This page doesn't exist or was moved. Head back to the dashboard.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
