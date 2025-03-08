"use client";

import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { toast } from "react-hot-toast";

interface PlanCardProps {
  plan: Doc<"plans">;
}

function PlanCard({ plan }: PlanCardProps) {
  const remove = useMutation(api.plans.remove);

  const handleDelete = async () => {
    try {
      await remove({ id: plan._id });
      toast.success("Plan deleted successfully!");
    } catch (error) {
      console.error("Failed to delete plan:", error);
      toast.error("Failed to delete plan. Please try again.");
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold">{plan.title}</h3>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
          <p className="text-sm text-muted-foreground">{format(plan.createdAt, "PPP")}</p>
        </div>
        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export { PlanCard };
