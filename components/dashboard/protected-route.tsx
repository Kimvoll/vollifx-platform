"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMockSession } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const session = getMockSession();
    if (!session?.authenticated) {
      setAllowed(false);
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (pathname.startsWith("/dashboard/admin") && session.user?.role !== "admin") {
      setAllowed(false);
      router.replace("/dashboard");
      return;
    }
    setAllowed(true);
  }, [pathname, router]);

  if (allowed !== true) {
    return null;
  }

  return <>{children}</>;
}
