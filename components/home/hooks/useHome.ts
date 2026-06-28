"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export function useHome(): { isReady: boolean } {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) router.replace("/dashboard");
  }, [user, isLoading, router]);

  // Render the landing page immediately — don't block on auth loading.
  // If the user IS logged in we redirect above; if not, show the page.
  // Only suppress once we know they're logged in to avoid a flash.
  return { isReady: !(user && !isLoading) };
}
