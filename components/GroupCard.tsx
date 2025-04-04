import { Doc } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "react-hot-toast";
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
import { Users } from "lucide-react";

interface GroupCardProps {
  group: Doc<"groups">;
  isAdmin?: boolean;
  isMember?: boolean;
  onLeave?: () => void;
  onDelete?: () => void;
}

export function GroupCard({ group, isAdmin, isMember, onLeave, onDelete }: GroupCardProps) {
  const router = useRouter();
  const { user } = useUser();

  const joinGroup = useMutation(api.groups.joinGroup);
  const leaveGroup = useMutation(api.groups.leaveGroup);
  const deleteGroup = useMutation(api.groups.deleteGroup);

  const handleJoin = async () => {
    try {
      await joinGroup({ groupId: group._id });
      toast.success("Successfully joined the group!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to join group");
    }
  };

  const handleLeave = async () => {
    try {
      await leaveGroup({ groupId: group._id });
      toast.success("Successfully left the group");
      onLeave?.();
      router.refresh();
    } catch (error) {
      toast.error("Failed to leave group");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGroup({ groupId: group._id });
      toast.success("Group deleted successfully");
      onDelete?.();
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete group");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={group.imageUrl} />
          <AvatarFallback>{group.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{group.name}</h3>
          {group.description && <p className="text-sm text-muted-foreground">{group.description}</p>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{group.memberCount} members</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {!isMember && (
          <Button onClick={handleJoin} variant="outline">
            Join Group
          </Button>
        )}
        {isMember && !isAdmin && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Leave Group</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave Group</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to leave this group? You can always join back later.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLeave}>Leave Group</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {isAdmin && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Group</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Group</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to delete this group? This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Group
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <Button onClick={() => router.push(`/groups/${group._id}`)} variant="default">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
