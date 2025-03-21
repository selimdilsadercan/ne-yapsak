import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";

interface ListCardProps {
  title: string;
  description?: string;
  imageUrl: string;
  href: string;
}

export function ListCard({ title, description, imageUrl, href }: ListCardProps) {
  return (
    <Link href={href}>
      <Card className="group relative overflow-hidden rounded-lg bg-gradient-to-b from-transparent to-black/60 transition-all hover:scale-105">
        <div className="aspect-square">
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {description && <p className="mt-1 text-sm text-white/80">{description}</p>}
          </div>
          <div className="absolute right-4 top-4 rounded-full bg-primary p-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Play className="h-4 w-4 text-white" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
