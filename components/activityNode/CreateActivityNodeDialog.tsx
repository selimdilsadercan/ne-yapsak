import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateActivityModal } from "@/components/activity/CreateActivityModal";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "react-hot-toast";
import { PlusCircle } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { ActivityListItem } from "../activity/ActivityListItem";

interface CreateActivityNodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: Id<"users">;
  groupId?: Id<"groups">;
  onCreated?: () => void;
}

export function CreateActivityNodeDialog({ open, onOpenChange, userId, groupId, onCreated }: CreateActivityNodeDialogProps) {
  const [selectedActivity, setSelectedActivity] = useState<Id<"activities"> | null>(null);
  const [showCreateActivity, setShowCreateActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [search, setSearch] = useState("");
  const createNode = useMutation(api.activityNodes.create);
  const [selectedGroup, setSelectedGroup] = useState<Id<"groups"> | undefined>(groupId);
  const groups = useQuery(api.groups.listMyGroups, {});
  const activities = useQuery(api.activities.getAll, {}) || [];
  const filtered = activities.filter((activity: any) => {
    const q = search.toLowerCase();
    return activity.name.toLowerCase().includes(q) || (activity.description?.toLowerCase().includes(q) ?? false);
  });

  const handleCreate = async () => {
    if (!selectedActivity) return;
    try {
      await createNode({
        activityId: selectedActivity,
        userId,
        groupId: selectedGroup ?? undefined
      });
      toast.success("Activity node created!");
      onCreated?.();
      onOpenChange(false);
    } catch (e) {
      toast.error("Failed to create activity node");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Create Activity Node</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {groups && groups.length > 0 && (
            <select
              value={selectedGroup ?? ""}
              onChange={(e) => setSelectedGroup(e.target.value ? (e.target.value as Id<"groups">) : undefined)}
              className="w-full border rounded p-2"
            >
              <option value="">Bireysel</option>
              {groups.map((g: any) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          )}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities..."
            className="mb-2 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
          />
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {filtered.map((activity: any) => (
              <ActivityListItem
                key={activity._id}
                activity={activity}
                selected={selectedActivity === activity._id}
                onSelect={() => setSelectedActivity(activity._id)}
                onEdit={(a) => {
                  setEditingActivity(a);
                  setShowEditModal(true);
                }}
              />
            ))}
          </div>
          <Button variant="outline" className="w-full flex items-center gap-2" onClick={() => setShowCreateActivity(true)} type="button">
            <PlusCircle className="w-4 h-4" /> Create New Activity
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={!selectedActivity} className="w-full mt-2">
            Create
          </Button>
        </DialogFooter>
        <CreateActivityModal
          open={showCreateActivity}
          onOpenChange={setShowCreateActivity}
          onCreated={(id: Id<"activities">) => {
            setSelectedActivity(id);
            setShowCreateActivity(false);
          }}
        />
        <CreateActivityModal
          open={showEditModal}
          onOpenChange={(open) => {
            setShowEditModal(open);
            if (!open) setEditingActivity(null);
          }}
          activity={editingActivity}
          onCreated={() => {
            setShowEditModal(false);
            setEditingActivity(null);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
