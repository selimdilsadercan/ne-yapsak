import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { ActivityCard } from "./ActivityCard";
import { EmptyState } from "./EmptyState";

interface ActivityListProps {
  userId?: string;
}

export function ActivityList({ userId }: ActivityListProps) {
  const userActivities = useQuery(api.userActivities.getUserActivities, userId ? { userId } : "skip");

  if (!userId) {
    return <EmptyState message="Listelerini görmek için giriş yapmalısın" />;
  }

  if (!userActivities?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-lg font-medium">No activities found</h3>
        <p className="text-sm text-muted-foreground">There are no activities available at the moment.</p>
      </div>
    );
  }

  const validUserActivities = userActivities.filter(
    (
      userActivity
    ): userActivity is NonNullable<typeof userActivity> & {
      activity: NonNullable<typeof userActivity.activity>;
    } => userActivity !== null && userActivity.activity !== null
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {validUserActivities.map((userActivity) => (
        <ActivityCard key={userActivity._id} userActivity={userActivity} onUpdate={() => {}} />
      ))}
    </div>
  );
}
