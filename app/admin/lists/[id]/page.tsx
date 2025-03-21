"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Plus, Users, Lock, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { Id } from "@/convex/_generated/dataModel";

// Define the item types and their properties
const itemTypes = [
  { id: "movies", label: "Movies", contentType: "movie" },
  { id: "series", label: "Series", contentType: "series" },
  { id: "games", label: "Games", contentType: "game" },
  { id: "places", label: "Places", contentType: "place" },
  { id: "activities", label: "Activities", contentType: "activity" }
];

// Columns for the items table
const columns: ColumnDef<any>[] = [
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
  }
];

export default function ListDetailPage() {
  const params = useParams();
  const listId = params.id as Id<"lists">;
  const list = useQuery(api.lists.getList, { listId });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState(itemTypes[0].id);

  // Query items based on type and search term
  const movies = useQuery(api.search.searchMovies, { query: searchTerm }) || [];
  const series = useQuery(api.search.searchSeries, { query: searchTerm }) || [];
  const games = useQuery(api.search.searchGames, { query: searchTerm }) || [];
  const places = useQuery(api.search.searchPlaces, { query: searchTerm }) || [];
  const activities = useQuery(api.search.searchActivities, { query: searchTerm }) || [];

  const addItemToList = useMutation(api.lists.addItemToList);

  const handleAddItem = async (item: any, type: string) => {
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
      toast.error("Failed to add item to list");
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
          <h1 className="text-3xl font-bold tracking-tight mb-1">{list.name}</h1>
          {list.description && <p className="text-muted-foreground mb-4">{list.description}</p>}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="capitalize">{list.type}</span>
            <span>{list.itemCount} items</span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {list.followerCount}
            </span>
            {!list.isPublic && (
              <span className="flex items-center gap-1">
                <Lock className="h-4 w-4" />
                Private
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
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
                    <TabsContent key={type.id} value={type.id} className="py-4">
                      <div className="divide-y">
                        {itemsByType[type.id as keyof typeof itemsByType]?.map((item: any) => (
                          <div key={item._id} className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                            </div>
                            <Button variant="ghost" onClick={() => handleAddItem(item, type.contentType)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
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

      {list.imageUrl && (
        <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
          <img src={list.imageUrl} alt={list.name} className="object-cover w-full h-full" />
        </div>
      )}

      <div className="rounded-lg border">
        <DataTable
          columns={columns}
          data={list.items || []}
          pagination={{
            pageSize: 10,
            pageIndex: 0
          }}
        />
      </div>
    </div>
  );
}
