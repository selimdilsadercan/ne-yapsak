"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PlanCard } from "@/components/plans/PlanCard";

function DiscoverPage() {
  const plans = useQuery(api.plans.listPublic);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Discover Plans</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans?.map((plan) => (
            <PlanCard key={plan._id} plan={plan} mode="discover" />
          ))}
          {plans?.length === 0 && (
            <div className="col-span-full rounded-lg border bg-card p-4 text-card-foreground">
              <p className="text-muted-foreground">No public plans available yet.</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default DiscoverPage;
