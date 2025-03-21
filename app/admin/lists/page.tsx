"use client";

import { ListCard } from "@/components/lists/ListCard";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ListsPage() {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lists</h1>
          <p className="text-muted-foreground">Create and manage your collections</p>
        </div>
        <Button asChild>
          <Link href="/admin/lists/new">
            <Plus className="mr-2 h-4 w-4" />
            New List
          </Link>
        </Button>
      </div>

      <Lists />
    </div>
  );
}

function Lists() {
  const lists = useQuery(api.lists.getLists, {
    includePrivate: true
  });

  if (!lists) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-full h-[300px] rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (lists.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No lists found</h3>
        <p className="text-muted-foreground mb-6">Get started by creating your first list</p>
        <Button asChild>
          <Link href="/admin/lists/new">
            <Plus className="mr-2 h-4 w-4" />
            Create List
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lists.map((list) => (
        <ListCard key={list._id} list={list} isOwner />
      ))}
    </div>
  );
}
