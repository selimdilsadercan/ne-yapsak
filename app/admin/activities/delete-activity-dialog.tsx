import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "react-hot-toast";
import { Activity } from "./columns";

interface DeleteActivityDialogProps {
  activity: Activity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteActivityDialog({ activity, open, onOpenChange }: DeleteActivityDialogProps) {
  const deleteActivity = useMutation(api.activities.deleteActivity);

  async function handleDelete() {
    try {
      await deleteActivity({ id: activity._id });
      toast.success("Activity deleted successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete activity");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Activity</DialogTitle>
          <DialogDescription>Are you sure you want to delete "{activity.name}"? This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
