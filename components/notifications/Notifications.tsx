"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GroupInviteNotification } from "./GroupInviteNotification";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Notifications() {
  const pendingInvites = useQuery(api.invites.getAllPendingInvitesForUser);

  const hasNotifications = pendingInvites && pendingInvites.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {pendingInvites.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <ScrollArea className="h-[300px] px-4 py-2">
          {pendingInvites?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
          ) : (
            <div className="space-y-4">
              {pendingInvites?.map((invite) => (
                <GroupInviteNotification key={invite._id} inviteId={invite._id} groupId={invite.groupId} groupName={invite.groupName} />
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
