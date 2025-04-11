import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Users, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface OnlineUsersPanelProps {
  sessionId: Id<"sessions">;
}

export function OnlineUsersPanel({ sessionId }: OnlineUsersPanelProps) {
  const router = useRouter();
  const session = useQuery(api.sessions.getSession, { sessionId });
  const leaveSession = useMutation(api.sessions.leaveSession);
  const now = Date.now();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!session) return null;

  const handleLeaveSession = async () => {
    try {
      router.push("/home");
      await leaveSession({ sessionId });
      toast.success("Oturumdan ayrıldınız");
    } catch (error) {
      toast.error("Oturumdan ayrılırken bir hata oluştu");
    }
  };

  // Consider users active if they've been active in the last 30 seconds
  const activeMembers = session.members.filter((member) => now - member.lastActiveAt < 30000);

  return (
    <div className={`fixed top-6 transition-all duration-300 ${isCollapsed ? "right-[-200px]" : "right-6"}`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute left-[-32px] top-4 bg-background border rounded-l-md p-1 shadow-sm hover:bg-accent"
      >
        {isCollapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>
      <Card className="p-4 w-[240px]">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Online Kullanıcılar</h3>
          </div>

          <Button variant="outline" size="sm" onClick={handleLeaveSession} className="w-full text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Oturumdan Ayrıl
          </Button>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {session.members.map((member) => {
                const isActive = now - member.lastActiveAt < 30000;
                return (
                  <div key={member._id} className="flex items-center gap-3">
                    <div className="relative">
                      {member.user?.image ? (
                        <Image src={member.user.image} alt={member.user.name || ""} width={32} height={32} className="rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${isActive ? "bg-green-500" : "bg-gray-300"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.user?.name || "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">{member.votesCount} oy</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}
