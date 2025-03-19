import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Icons from "lucide-react";

interface ActivityCardProps {
  title: string;
  category: string;
  iconName: string;
}

function ActivityCard({ title, iconName }: ActivityCardProps) {
  // @ts-ignore - We know these icons exist in lucide-react
  const Icon = Icons[iconName];

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <div className="flex flex-col items-center p-2 gap-1.5">
        <div className="w-full aspect-[4/3] flex items-center justify-center bg-muted/50 rounded-md">
          {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
        </div>
        <h3 className="text-xs font-medium text-center line-clamp-2 leading-tight">{title}</h3>
      </div>
    </Card>
  );
}

export { ActivityCard };
