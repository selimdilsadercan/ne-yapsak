"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";

interface ListCardProps {
  title: string;
  description?: string;
  href: string;
}

export function ListCard({ title, description, href }: ListCardProps) {
  return (
    <Link href={href} className="block h-full">
      <Card className="h-full p-4 transition-colors hover:bg-accent">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </Card>
    </Link>
  );
}
