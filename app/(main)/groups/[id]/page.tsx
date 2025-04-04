"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Users, ArrowLeft, UserPlus, Trash2, Info, Edit2, Wand2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "react-hot-toast";

interface GroupInvite {
  _id: Id<"groupInvites">;
  email: string;
  name: string;
  role: string;
  status: string;
  invitedAt: number;
  expiresAt: number;
}

export default function GroupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as Id<"groups">;
  const groupDetails = useQuery(api.groups.getGroupDetails, { groupId });
  const pendingInvites = useQuery(api.invites.getPendingInvites, { groupId });
  const [isOpen, setIsOpen] = useState(false);
  const [editingInvite, setEditingInvite] = useState<Id<"groupInvites"> | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "member"
  });

  const createInvite = useMutation(api.invites.createInvite);
  const updateInvite = useMutation(api.invites.updateInvite);
  const deleteInvite = useMutation(api.invites.deleteInvite);
  const removeMember = useMutation(api.groups.removeMember);

  const generateEmailFromName = (name: string) => {
    return (
      name
        .toLowerCase()
        .replace(/\s+/g, "") // Remove all spaces
        .replace(/[^a-z0-9]/g, "") + // Remove special characters and keep only alphanumeric
      "@gmail.com"
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: newName
    }));
  };

  const handleSuggestEmail = () => {
    if (formData.name) {
      setFormData((prev) => ({
        ...prev,
        email: generateEmailFromName(prev.name)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingInvite) {
        await updateInvite({
          inviteId: editingInvite,
          email: formData.email,
          name: formData.name,
          role: formData.role
        });
        toast.success("Invitation updated successfully!");
      } else {
        await createInvite({
          groupId,
          email: formData.email,
          name: formData.name,
          role: formData.role
        });
        toast.success("Invitation sent successfully!");
      }
      setIsOpen(false);
      setEditingInvite(null);
      setFormData({ email: "", name: "", role: "member" });
    } catch (error) {
      console.error(error);
      toast.error(editingInvite ? "Failed to update invitation" : "Failed to send invitation");
    }
  };

  const handleEdit = (invite: GroupInvite) => {
    setEditingInvite(invite._id);
    setFormData({
      email: invite.email,
      name: invite.name,
      role: invite.role
    });
    setIsOpen(true);
  };

  const handleDelete = async (inviteId: Id<"groupInvites">) => {
    try {
      await deleteInvite({ inviteId });
      toast.success("Invitation deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete invitation");
    }
  };

  const handleRemoveMember = async (memberId: Id<"groupMembers">) => {
    try {
      await removeMember({ groupId, memberId });
      toast.success("Member removed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove member");
    }
  };

  if (!groupDetails || !pendingInvites) {
    return (
      <div className="container mx-auto py-8 max-w-screen-xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Groups
        </Button>
        <div className="text-center text-muted-foreground">Loading group details...</div>
      </div>
    );
  }

  const isAdmin = groupDetails.members.some((member) => member.user?.clerkId === groupDetails.currentUser.clerkId && member.role === "admin");

  return (
    <div className="container mx-auto py-4 max-w-screen-xl">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Groups
      </Button>

      <div className="space-y-8">
        {/* Group Header */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={groupDetails.imageUrl} />
            <AvatarFallback>{groupDetails.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{groupDetails.name}</h1>
            {groupDetails.description && <p className="mt-2 text-muted-foreground">{groupDetails.description}</p>}
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{groupDetails.memberCount} members</span>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Members</h2>
            {isAdmin && (
              <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                  if (!open) {
                    setEditingInvite(null);
                    setFormData({ email: "", name: "", role: "member" });
                  }
                  setIsOpen(open);
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>{editingInvite ? "Edit Invitation" : "Invite New Member"}</DialogTitle>
                      <DialogDescription>{editingInvite ? "Update the invitation details." : "Send an invitation to join the group."}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={formData.name} onChange={handleNameChange} placeholder="Enter member name" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="flex gap-2">
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter email address"
                            required
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleSuggestEmail}
                            disabled={!formData.name}
                            title="Suggest email from name"
                          >
                            <Wand2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">{editingInvite ? "Update Invitation" : "Send Invitation"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Active Members */}
            {groupDetails.members.map((member) => (
              <Card key={member._id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={member.user?.image} />
                      <AvatarFallback>{member.user?.name?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{member.user?.name || "Unknown User"}</h3>
                      <p className="text-sm text-muted-foreground">{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Joined {formatDistanceToNow(member.joinedAt)} ago</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {isAdmin && member._id.toString() !== groupDetails.currentUser._id.toString() && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this member from the group? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemoveMember(member._id)}>Remove</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}

            {/* Pending Invites */}
            {pendingInvites.map((invite) => (
              <Card key={invite._id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{invite.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{invite.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{invite.role.charAt(0).toUpperCase() + invite.role.slice(1)}</span>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p>{invite.email}</p>
                            <p>Invited {formatDistanceToNow(invite.invitedAt)} ago</p>
                            <p>Expires in {formatDistanceToNow(invite.expiresAt)}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {isAdmin && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(invite)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Invitation</AlertDialogTitle>
                              <AlertDialogDescription>Are you sure you want to delete this invitation? This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(invite._id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
