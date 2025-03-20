"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
      return;
    }

    // Replace this condition with your actual admin check
    const isAdmin = user?.id === "user_2u1xfsYm07Gh5VtJ3AmSxZLx3TR";
    if (isLoaded && !isAdmin) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Replace this condition with your actual admin check
  const isAdmin = user?.id === "user_2u1xfsYm07Gh5VtJ3AmSxZLx3TR";
  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
