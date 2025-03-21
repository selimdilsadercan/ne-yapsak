"use client";

import { ListForm } from "@/components/lists/ListForm";

export default function NewListPage() {
  return (
    <div className="container max-w-2xl py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create New List</h1>
        <p className="text-muted-foreground">Create a new list to organize your items</p>
      </div>

      <ListForm />
    </div>
  );
}
