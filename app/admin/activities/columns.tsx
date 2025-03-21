import { ColumnDef, Row } from "@tanstack/react-table";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export type Activity = {
  _id: Id<"activities">;
  name: string;
  category: string;
  iconName: string;
  contentType: string;
  description?: string;
  imageUrl?: string;
};

type ActivityActionsProps = {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
};

export function ActivityActions({ activity, onEdit, onDelete }: ActivityActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(activity)}>
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(activity)} className="text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "category",
    header: "Category"
  },
  {
    accessorKey: "iconName",
    header: "Icon"
  },
  {
    accessorKey: "contentType",
    header: "Content Type"
  },
  {
    id: "actions",
    cell: ({ row }: { row: Row<Activity> }) => {
      const activity = row.original;
      return (
        <ActivityActions
          activity={activity}
          onEdit={(activity) => {
            // Handle edit in parent component
            console.log("Edit activity:", activity);
          }}
          onDelete={(activity) => {
            // Handle delete in parent component
            console.log("Delete activity:", activity);
          }}
        />
      );
    }
  }
];
