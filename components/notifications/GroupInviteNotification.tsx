"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";

interface GroupInviteNotificationProps {
  inviteId: Id<"groupInvites">;
  groupId: Id<"groups">;
  groupName: string;
}

export function GroupInviteNotification({ inviteId, groupId, groupName }: GroupInviteNotificationProps) {
  const router = useRouter();
  const acceptInvite = useMutation(api.invites.acceptInvite);

  const handleAccept = async () => {
    try {
      await acceptInvite({ inviteId });
      toast.success("Successfully joined the group!");
      router.push(`/groups/${groupId}`);
    } catch (error) {
      console.error("Failed to accept invite:", error);
      toast.error("Failed to join the group");
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm">You have been invited to join {groupName}</p>
      </div>
      <Button size="sm" onClick={handleAccept}>
        Accept & Join
      </Button>
    </div>
  );
}
