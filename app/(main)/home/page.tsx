"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ActivityNodeCard } from "@/components/activityNode/ActivityNodeCard";
import { CreateActivityNodeDialog } from "@/components/activityNode/CreateActivityNodeDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// import { useSession } from "@/lib/useSession";

export default function HomePage() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Always call hooks, never conditionally!
  const convexUser = user?.id ? useQuery(api.users.getUser, { clerkId: user.id }) : undefined;
  const nodes = useQuery(api.activityNodes.getByUser, convexUser?._id ? { userId: convexUser._id } : "skip") || [];
  const activities = useQuery(api.activities.getAll, {}) || [];
  const groups = useQuery(api.groups.listMyGroups, {}) || [];

  const activityMap = Object.fromEntries(activities.map((a: any) => [a._id, a]));
  const groupMap = Object.fromEntries(groups.map((g: any) => [g._id, g]));

  // Only render UI conditionally
  if (!convexUser?._id) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="relative min-h-screen bg-background p-4 pb-24">
      <div className="space-y-3">
        {nodes.map((node: any) => (
          <ActivityNodeCard
            key={node._id}
            node={node}
            activity={activityMap[node.activityId]}
            group={node.groupId ? groupMap[node.groupId] : undefined}
            user={convexUser}
          />
        ))}
      </div>
      <Button
        className="fixed bottom-24 right-6 rounded-full w-14 h-14 p-0 flex items-center justify-center shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => setOpen(true)}
        size="icon"
      >
        <Plus className="w-7 h-7" />
      </Button>
      <CreateActivityNodeDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setRefreshKey((k) => k + 1);
        }}
        userId={convexUser._id}
        onCreated={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
