import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

function NotificationsPopover() {
  const pendingInvites = useQuery(api.invites.getAllPendingInvitesForUser);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {pendingInvites && pendingInvites.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {pendingInvites.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-4">
          <h4 className="font-medium">Bildirimler</h4>
          {pendingInvites && pendingInvites.length > 0 && <span className="text-xs text-muted-foreground">{pendingInvites.length} yeni</span>}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {!pendingInvites || pendingInvites.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Bildirim bulunmuyor</div>
          ) : (
            <div className="divide-y">
              {pendingInvites.map((invite) => (
                <div key={invite._id} className="flex items-start gap-4 p-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{invite.groupName}</span> grubuna davet edildiniz
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(invite._creationTime), {
                        addSuffix: true,
                        locale: tr
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationsPopover;
