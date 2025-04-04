"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, ArrowLeft, UserPlus, Trash2 } from "lucide-react";
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
import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "react-hot-toast";

export default function GroupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as Id<"groups">;
  const groupDetails = useQuery(api.groups.getGroupDetails, { groupId });
  const pendingInvites = useQuery(api.invites.getPendingInvites, { groupId });
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "member"
  });

  const createInvite = useMutation(api.invites.createInvite);
  const deleteInvite = useMutation(api.invites.deleteInvite);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInvite({
        groupId,
        email: formData.email,
        name: formData.name,
        role: formData.role
      });
      toast.success("Invitation sent successfully!");
      setIsOpen(false);
      setFormData({ email: "", name: "", role: "member" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send invitation");
    }
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
    <div className="container mx-auto py-8 max-w-screen-xl">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
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
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>Invite New Member</DialogTitle>
                      <DialogDescription>Send an invitation to join the group.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter member name"
                          required
                        />
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
                      <Button type="submit">Send Invitation</Button>
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
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.user?.image} />
                    <AvatarFallback>{member.user?.name?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{member.user?.name || "Unknown User"}</h3>
                    <p className="text-sm text-muted-foreground">{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Joined {formatDistanceToNow(member.joinedAt)} ago</p>
                </CardContent>
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
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{invite.name}</h3>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{invite.role.charAt(0).toUpperCase() + invite.role.slice(1)}</p>
                    </div>
                  </div>
                  {isAdmin && (
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
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{invite.email}</p>
                  <p className="text-sm text-muted-foreground">Invited {formatDistanceToNow(invite.invitedAt)} ago</p>
                  <p className="text-sm text-muted-foreground">Expires in {formatDistanceToNow(invite.expiresAt)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
