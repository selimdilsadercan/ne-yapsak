"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GroupCard } from "@/components/GroupCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { Plus } from "lucide-react";

export default function GroupsPage() {
  const groups = useQuery(api.groups.listMyGroups);
  const createGroup = useMutation(api.groups.create);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGroup(formData);
      toast.success("Group created successfully!");
      setIsOpen(false);
      setFormData({ name: "", description: "", imageUrl: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create group");
    }
  };

  const safeGroups = groups?.filter((group): group is NonNullable<typeof group> => group !== null) ?? [];

  return (
    <div className="container mx-auto py-8 max-w-screen-xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Groups</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogDescription>Create a new group to collaborate with others.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter group name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter group description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Enter image URL"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Group</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {safeGroups.map((group) => (
          <GroupCard key={group._id} group={group} />
        ))}
        {safeGroups.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">You are not a member of any groups yet. Create one or join existing groups!</div>
        )}
      </div>
    </div>
  );
}
