"use client";

import { SignInButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UserButton } from "./UserButton";

function AuthButton() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <UserButton />;
  }

  return (
    <SignInButton mode="modal">
      <Button variant="outline" size="sm">
        Sign In
      </Button>
    </SignInButton>
  );
}

export { AuthButton };
