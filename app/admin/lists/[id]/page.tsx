"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Plus, Users, Pencil, ArrowLeft, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { Id } from "@/convex/_generated/dataModel";
import { ListDialog } from "@/components/lists/EditListDialog";
import { AddListItemDialog } from "@/components/lists/AddListItemDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";

// Define the item types and their properties
const itemTypes = [
  { id: "movies", label: "Movies", contentType: "movie" },
  { id: "series", label: "Series", contentType: "series" },
  { id: "games", label: "Games", contentType: "game" },
  { id: "places", label: "Places", contentType: "place" },
  { id: "activities", label: "Activities", contentType: "activity" }
];

// Define interfaces for different item types
interface BaseItem {
  _id: Id<"movies" | "series" | "games" | "places" | "activities">;
  description?: string;
}

interface NamedItem extends BaseItem {
  name: string;
  title?: never;
}

interface TitledItem extends BaseItem {
  title: string;
  name?: never;
}

type ItemType = NamedItem | TitledItem;

// Columns for the items table
const columns = (
  listId: Id<"lists">
): ColumnDef<{
  _id: Id<"listItems">;
  itemId: string;
  name: string;
  type: string;
  imageUrl?: string;
  addedAt: number;
}>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          {row.original.imageUrl && (
            <div className="relative h-10 w-10 overflow-hidden rounded">
              <Image src={row.original.imageUrl} alt={row.original.name} fill className="object-cover" />
            </div>
          )}
          <span>{row.original.name}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.type}</span>;
    }
  },
  {
    accessorKey: "addedAt",
    header: "Added",
    cell: ({ row }) => {
      const date = new Date(row.original.addedAt);
      return date.toLocaleDateString();
    }
  },
  {
    id: "actions",
    cell: function ActionCell({ row }) {
      const removeItemFromList = useMutation(api.lists.removeItemFromList);

      const handleRemove = async () => {
        try {
          await removeItemFromList({
            listId,
            itemId: row.original.itemId
          });
          toast.success("Item removed from list");
        } catch (error) {
          toast.error(`Failed to remove item: ${error}`);
        }
      };

      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Item</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to remove this item from the list? This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRemove} className="bg-destructive hover:bg-destructive/90">
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }
  }
];

export default function ListDetailPage() {
  const router = useRouter();
  const params = useParams();
  const listId = params.id as Id<"lists">;
  const list = useQuery(api.lists.getList, { listId });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!list) {
    return (
      <div className="space-y-4">
        <div className="w-1/3 h-8 bg-muted animate-pulse rounded" />
        <div className="w-full h-[200px] bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{list.name}</h1>
            <p className="text-muted-foreground">{list.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit List
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns(listId)}
          data={
            list.items?.map((item) => ({
              _id: item._id,
              itemId: item.itemId,
              name: item.name,
              type: item.itemType,
              imageUrl: item.imageUrl,
              addedAt: item.addedAt
            })) || []
          }
        />
      </div>

      <ListDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} list={list} />
      <AddListItemDialog listId={listId} open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
}
