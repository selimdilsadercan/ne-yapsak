"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CreatePlanDialog } from "@/components/plans/CreatePlanDialog";
import { PlanCard } from "@/components/plans/PlanCard";
import { PageTemplate } from "@/components/layout/PageTemplate";
import Loading from "@/components/Loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

function PlansContent() {
  const [selectedCategory, setSelectedCategory] = useState<Id<"categories"> | null>(null);
  const plans = useQuery(api.plans.list, { categoryId: selectedCategory ?? undefined });
  const categories = useQuery(api.categories.list);

  if (plans === undefined || categories === undefined) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Plans</h1>
        <CreatePlanDialog />
      </div>

      <div className="w-full max-w-xs">
        <Label htmlFor="category-filter">Filter by Category</Label>
        <Select value={selectedCategory ?? "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? null : (value as Id<"categories">))}>
          <SelectTrigger id="category-filter">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan._id} plan={plan} mode="personal" />
        ))}
        {plans.length === 0 && (
          <div className="col-span-full rounded-lg border bg-card p-4 text-card-foreground">
            <p className="text-muted-foreground">
              {selectedCategory ? "No plans found in this category. Create one to get started!" : "No plans yet. Create one to get started!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PlansPage() {
  return (
    <PageTemplate>
      <PlansContent />
    </PageTemplate>
  );
}

export default PlansPage;
