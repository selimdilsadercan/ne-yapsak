"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../Loading";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (requireAuth && !isSignedIn) {
        router.push("/");
      }
    }
  }, [isLoaded, isSignedIn, requireAuth, router]);

  if (!isLoaded) {
    return <Loading />;
  }

  if (requireAuth && !isSignedIn) {
    return null;
  }

  return <>{children}</>;
}

export { AuthGuard };
