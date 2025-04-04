"use client";

import { ListCard } from "@/components/lists/ListCard";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ListDialog } from "@/components/lists/EditListDialog";

function Lists() {
  const lists = useQuery(api.lists.getLists, {}) || [];

  if (!lists) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-full h-[200px] rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (lists.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No lists found</h3>
        <p className="text-muted-foreground">Get started by creating your first list</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lists.map((list) => (
        <ListCard key={list._id} list={list} />
      ))}
    </div>
  );
}

export default function ListsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lists</h1>
          <p className="text-muted-foreground">Create and manage your collections</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New List
        </Button>
      </div>

      <Lists />

      <ListDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  );
}
