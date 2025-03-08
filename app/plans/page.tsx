"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CreatePlanDialog } from "@/components/plans/CreatePlanDialog";
import { PlanCard } from "@/components/plans/PlanCard";

function PlansPage() {
  const plans = useQuery(api.plans.list);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Plans</h1>
        <CreatePlanDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans?.map((plan) => (
          <PlanCard key={plan._id} plan={plan} />
        ))}
        {plans?.length === 0 && (
          <div className="col-span-full rounded-lg border bg-card p-4 text-card-foreground">
            <p className="text-muted-foreground">No plans yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlansPage;
