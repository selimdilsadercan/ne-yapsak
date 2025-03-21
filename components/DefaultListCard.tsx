import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DefaultListCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  className?: string;
}

export function DefaultListCard({ title, description, href, icon: Icon, className }: DefaultListCardProps) {
  return (
    <Link href={href}>
      <div className={cn("group flex items-start gap-3 rounded-lg bg-card transition-all hover:bg-accent sm:gap-4", className)}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground sm:h-12 sm:w-12">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold sm:text-base">{title}</h3>
          <p className="truncate text-xs text-muted-foreground sm:text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
}
