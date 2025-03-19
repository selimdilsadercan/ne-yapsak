import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  message: string;
  icon?: LucideIcon;
}

function EmptyState({ message, icon: Icon }: EmptyStateProps) {
  return (
    <div className="h-[200px] flex flex-col items-center justify-center text-center space-y-2">
      {Icon && <Icon className="h-8 w-8 text-muted-foreground" />}
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export { EmptyState };
