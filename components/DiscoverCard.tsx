import { Card } from "./ui/card";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface DiscoverCardProps {
  title: string;
  iconName: keyof typeof Icons;
  category: string;
}

export function DiscoverCard({ title, iconName }: DiscoverCardProps) {
  const IconComponent = (Icons[iconName] as LucideIcon) || Icons.HelpCircle;

  return (
    <Card className="w-full aspect-square flex flex-col items-center justify-center p-4 hover:bg-accent transition-colors">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center">
          <IconComponent size={32} strokeWidth={1.5} />
        </div>
        <p className="text-sm font-medium text-center">{title}</p>
      </div>
    </Card>
  );
}
