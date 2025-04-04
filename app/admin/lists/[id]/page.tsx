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
  addedAt: number;
}>[] => [
  {
    accessorKey: "name",
    header: "Name"
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState(itemTypes[0].id);

  // Query items based on type and search term
  const movies = useQuery(api.search.searchMovies, { query: searchTerm }) || [];
  const series = useQuery(api.search.searchSeries, { query: searchTerm }) || [];
  const games = useQuery(api.search.searchGames, { query: searchTerm }) || [];
  const places = useQuery(api.search.searchPlaces, { query: searchTerm }) || [];
  const activities = useQuery(api.search.searchActivities, { query: searchTerm }) || [];

  const addItemToList = useMutation(api.lists.addItemToList);
  const handleAddItem = async (item: { _id: Id<"movies" | "series" | "games" | "places" | "activities"> }, type: string) => {
    try {
      await addItemToList({
        listId,
        itemId: item._id,
        itemType: type,
        notes: ""
      });
      toast.success("Item added to list");
      setIsAddDialogOpen(false);
    } catch (error) {
      toast.error(`Failed to add item to list: ${error}`);
    }
  };

  if (!list) {
    return (
      <div className="space-y-4">
        <div className="w-1/3 h-8 bg-muted animate-pulse rounded" />
        <div className="w-full h-[200px] bg-muted animate-pulse rounded" />
      </div>
    );
  }

  const itemsByType = {
    movies,
    series,
    games,
    places,
    activities
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-muted-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{list.name}</h1>
              {list.description && <p className="text-muted-foreground">{list.description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{list.itemCount} items</span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {list.followerCount}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit List
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Item to List</DialogTitle>
                <DialogDescription>Search and select items to add to your list</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="mb-4" />
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="w-full justify-start">
                    {itemTypes.map((type) => (
                      <TabsTrigger key={type.id} value={type.id} className="capitalize">
                        {type.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {itemTypes.map((type) => (
                    <TabsContent key={type.id} value={type.id} className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {itemsByType[type.id as keyof typeof itemsByType]?.map((item: ItemType) => (
                          <Card key={item._id} className="cursor-pointer hover:bg-muted/50 transition" onClick={() => handleAddItem(item, type.id)}>
                            <CardHeader>
                              <CardTitle>{item.name || item.title}</CardTitle>
                              {item.description && <CardDescription>{item.description}</CardDescription>}
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
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
              addedAt: item.addedAt
            })) || []
          }
        />
      </div>

      <ListDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} list={list} />
    </div>
  );
}
