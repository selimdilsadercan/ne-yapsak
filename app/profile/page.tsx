"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

function ProfilePage() {
  const { user } = useUser();

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Profile</h1>
          <SignOutButton>
            <Button variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </SignOutButton>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground">
          <div className="flex items-center gap-4">
            <img src={user?.imageUrl} alt={user?.fullName || "Profile"} className="h-20 w-20 rounded-full bg-muted object-cover" />
            <div>
              <h2 className="text-xl font-semibold">{user?.fullName}</h2>
              <p className="text-sm text-muted-foreground">{user?.emailAddresses[0].emailAddress}</p>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Activity History</h2>
          <div className="rounded-lg border bg-card p-4 text-card-foreground">
            <p className="text-muted-foreground">Your activity history will appear here.</p>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

export default ProfilePage;
