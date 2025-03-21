"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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
import { Pencil, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

interface ListCardProps {
  list: {
    _id: Id<"lists">;
    name: string;
    description?: string;
    type: string;
    isPublic: boolean;
    imageUrl?: string;
    itemCount: number;
    followerCount?: number;
  };
  isOwner?: boolean;
  onEdit?: () => void;
}

export function ListCard({ list, isOwner, onEdit }: ListCardProps) {
  const router = useRouter();
  const deleteList = useMutation(api.lists.deleteList);

  const handleDelete = async () => {
    try {
      await deleteList({ listId: list._id });
      toast.success("List deleted successfully");
    } catch (error) {
      toast.error(`Failed to delete the list: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {list.name}
              {!list.isPublic && <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">Private</span>}
            </CardTitle>
            <CardDescription>{list.description}</CardDescription>
          </div>
          {isOwner && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete List</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to delete this list? This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {list.imageUrl && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
            <Image src={list.imageUrl} alt={list.name} fill className="object-cover" />
          </div>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="capitalize">{list.type}</span>
          <span>{list.itemCount} items</span>
          {list.followerCount !== undefined && (
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {list.followerCount}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="secondary" onClick={() => router.push(`/admin/lists/${list._id}`)}>
          View List
        </Button>
      </CardFooter>
    </Card>
  );
}
