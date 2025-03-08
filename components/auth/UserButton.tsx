"use client";

import { UserButton as ClerkUserButton } from "@clerk/nextjs";

function UserButton() {
  return (
    <ClerkUserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: "h-10 w-10",
          userButtonPopoverCard: "border border-border",
          userButtonPopoverActionButton: "hover:bg-accent hover:text-accent-foreground",
          userButtonPopoverActionButtonText: "text-sm",
          userButtonPopoverFooter: "hidden"
        }
      }}
    />
  );
}

export { UserButton };
