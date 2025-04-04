"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function UserSync() {
  const { user, isLoaded } = useUser();
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (isLoaded && user) {
      storeUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || user.username || "Anonymous",
        imageUrl: user.imageUrl
      }).catch((error) => {
        console.error("Failed to sync user:", error);
      });
    }
  }, [isLoaded, user, storeUser]);

  return null;
}
