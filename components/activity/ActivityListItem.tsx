import { CheckCircle, Pencil } from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityListItemProps {
  activity: any;
  selected: boolean;
  onSelect: () => void;
  onEdit?: (activity: any) => void;
}

export function ActivityListItem({ activity, selected, onSelect, onEdit }: ActivityListItemProps) {
  const LucideIcon = (activity?.iconName && Icons[activity.iconName as keyof typeof Icons]) || CheckCircle;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn("w-full flex items-center gap-3 p-3 rounded border hover:bg-muted transition text-left", selected && "border-primary bg-primary/10")}
    >
      <span className="w-8 h-8 flex items-center justify-center bg-muted rounded-full">
        <LucideIcon className="w-5 h-5 text-primary" />
      </span>
      <span className="flex-1">
        <div className="font-medium">{activity.name}</div>
        {activity.description && <div className="text-xs text-muted-foreground">{activity.description}</div>}
      </span>
      {onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(activity);
          }}
          className="ml-2 p-1 rounded border border-input hover:bg-accent transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}
      {selected && <CheckCircle className="w-5 h-5 text-primary" />}
    </button>
  );
}
