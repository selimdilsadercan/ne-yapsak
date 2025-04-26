import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import * as Icons from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

// Precompute a map of valid Lucide icon components
const LucideIconMap: Record<string, React.ComponentType<{ className?: string }>> = {};
for (const key in Icons) {
  if (
    typeof Icons[key as keyof typeof Icons] === "function" &&
    key.startsWith("Lucide") &&
    (Icons[key as keyof typeof Icons] as Function).length <= 1 &&
    !("iconNode" in Icons[key as keyof typeof Icons])
  ) {
    LucideIconMap[key.replace(/^Lucide/, "")] = Icons[key as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
  }
}

interface ActivitySelectListProps {
  selected: Id<"activities"> | null;
  onSelect: (id: Id<"activities">) => void;
  search: string;
  setSearch: (s: string) => void;
}

export function ActivitySelectList({ selected, onSelect, search, setSearch }: ActivitySelectListProps) {
  const activities = useQuery(api.activities.getAll, {}) || [];
  const filtered = activities.filter((activity: any) => {
    const q = search.toLowerCase();
    return activity.name.toLowerCase().includes(q) || (activity.description?.toLowerCase().includes(q) ?? false);
  });

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search activities..."
        className="mb-2 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
      />
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {filtered.map((activity) => {
          const IconComponent = LucideIconMap[activity.iconName] || CheckCircle;
          return (
            <button
              key={activity._id}
              type="button"
              onClick={() => onSelect(activity._id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded border hover:bg-muted transition text-left",
                selected === activity._id && "border-primary bg-primary/10"
              )}
            >
              <span className="w-8 h-8 flex items-center justify-center bg-muted rounded-full">
                <IconComponent className="w-5 h-5 text-primary" />
              </span>
              <span className="flex-1">
                <div className="font-medium">{activity.name}</div>
                {activity.description && <div className="text-xs text-muted-foreground">{activity.description}</div>}
              </span>
              {selected === activity._id && <CheckCircle className="w-5 h-5 text-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
