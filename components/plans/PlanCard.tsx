"use client";

import { format } from "date-fns";
import { Trash2, Share2, UserCircle2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { toast } from "react-hot-toast";

interface PlanCardProps {
  plan: Doc<"plans">;
  mode?: "personal" | "discover" | "friend";
}

function PlanCard({ plan, mode = "personal" }: PlanCardProps) {
  const remove = useMutation(api.plans.remove);
  const togglePublic = useMutation(api.plans.togglePublic);
  const creator = useQuery(api.users.getById, { userId: plan.creatorId });

  const handleDelete = async () => {
    try {
      await remove({ id: plan._id });
      toast.success("Plan deleted successfully!");
    } catch (error) {
      console.error("Failed to delete plan:", error);
      toast.error("Failed to delete plan. Please try again.");
    }
  };

  const handleTogglePublic = async () => {
    try {
      await togglePublic({ id: plan._id });
      toast.success(plan.isPublic ? "Plan is now private" : "Plan is now public and discoverable");
    } catch (error) {
      console.error("Failed to update plan:", error);
      toast.error("Failed to update plan. Please try again.");
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">{plan.title}</h3>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
            <p className="text-sm text-muted-foreground">{format(plan.createdAt, "PPP")}</p>
          </div>
          {mode === "personal" && (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className={plan.isPublic ? "text-primary" : "text-muted-foreground"} onClick={handleTogglePublic}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {(mode === "discover" || mode === "friend") && creator && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserCircle2 className="h-4 w-4" />
            <span>Created by {creator.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export { PlanCard };
