"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns, Activity, ActivityActions } from "./columns";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddActivityDialog } from "./add-activity-dialog";
import { useState } from "react";
import { EditActivityDialog } from "./edit-activity-dialog";
import { DeleteActivityDialog } from "./delete-activity-dialog";
import { Row } from "@tanstack/react-table";

export default function AdminActivitiesPage() {
  const activities = useQuery(api.activities.getAll);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);

  if (!activities) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
  };

  const handleDelete = (activity: Activity) => {
    setDeletingActivity(activity);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Activities Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </div>

      <DataTable
        columns={columns.map((column) => {
          if (column.id === "actions") {
            return {
              ...column,
              cell: ({ row }: { row: Row<Activity> }) => {
                const activity = row.original;
                return <ActivityActions activity={activity} onEdit={handleEdit} onDelete={handleDelete} />;
              }
            };
          }
          return column;
        })}
        data={activities}
        pagination={{
          pageSize: 10,
          pageIndex: 0
        }}
      />

      <AddActivityDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      {editingActivity && <EditActivityDialog activity={editingActivity} open={!!editingActivity} onOpenChange={(open) => !open && setEditingActivity(null)} />}
      {deletingActivity && (
        <DeleteActivityDialog activity={deletingActivity} open={!!deletingActivity} onOpenChange={(open) => !open && setDeletingActivity(null)} />
      )}
    </div>
  );
}
