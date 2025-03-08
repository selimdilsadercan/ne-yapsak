"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

function SyncUser() {
  const { user, isLoaded } = useUser();
  const storeUser = useMutation(api.users.store);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      storeUser({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName || "",
        image: user.imageUrl
      })
        .then(() => {
          router.push("/plans");
        })
        .catch((error) => {
          console.error("Failed to sync user:", error);
          toast.error("Something went wrong. Please try again.");
        });
    }
  }, [user, isLoaded, storeUser, router]);

  return null;
}

export { SyncUser };
