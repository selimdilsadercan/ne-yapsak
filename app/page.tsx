"use client";

import { useAuth, SignInButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { PlanCard } from "@/components/plans/PlanCard";
import Loading from "@/components/Loading";

function AuthenticatedContent() {
  const friendsPlans = useQuery(api.plans.listFriendsActivity);

  if (friendsPlans === undefined) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Friends&apos; Activities</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {friendsPlans.map((plan) => (
          <PlanCard key={plan._id} plan={plan} mode="friend" />
        ))}
        {friendsPlans.length === 0 && (
          <div className="col-span-full rounded-lg border bg-card p-4 text-card-foreground">
            <p className="text-muted-foreground">No friend activities yet. Add some friends or check out the discover page!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function HomePage() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Ne Yapsak?</h1>
          <p className="text-xl text-muted-foreground">Plan activities and have fun with your friends!</p>
        </div>
        <SignInButton mode="modal">
          <Button size="lg" className="text-lg">
            Get Started
          </Button>
        </SignInButton>
      </div>
    );
  }

  return <AuthenticatedContent />;
}

export default HomePage;
