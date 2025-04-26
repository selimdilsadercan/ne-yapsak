import { CheckCircle } from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityNodeCardProps {
  node: any;
  activity: any;
  group?: any;
  user: any;
}

export function ActivityNodeCard({ node, activity, group, user }: ActivityNodeCardProps) {
  const LucideIcon = (activity?.iconName && Icons[activity.iconName as keyof typeof Icons]) || CheckCircle;
  return (
    <div className={cn("flex items-center gap-4 p-4 border rounded-lg bg-background hover:bg-muted transition cursor-pointer")}>
      <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-full">
        <LucideIcon className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-base">{activity?.name}</div>
        <div className="text-xs text-muted-foreground mt-1">{group ? group.name : user?.name}</div>
      </div>
      <CheckCircle className="w-6 h-6 text-primary" />
    </div>
  );
}
