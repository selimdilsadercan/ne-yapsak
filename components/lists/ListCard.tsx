"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";

interface ListCardProps {
  list: {
    _id: Id<"lists">;
    name: string;
    description?: string;
    createdBy: string;
    itemCount: number;
    followerCount: number;
    tags?: string[];
  };
}

export function ListCard({ list }: ListCardProps) {
  return (
    <Link href={`/admin/lists/${list._id}`}>
      <Card className="hover:bg-muted/50 transition">
        <CardHeader>
          <CardTitle>{list.name}</CardTitle>
          {list.description && <CardDescription>{list.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{list.itemCount} items</span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {list.followerCount}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
