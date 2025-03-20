import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { EventCard } from "./EventCard";
import { EmptyState } from "./EmptyState";
import { Doc } from "../convex/_generated/dataModel";

interface EventListProps {
  userId?: string;
}

type UserEventWithActivity = Doc<"userEvents"> & {
  activity: NonNullable<Doc<"activities">>;
};

export function EventList({ userId }: EventListProps) {
  const userEvents = useQuery(api.userEvents.getUserEvents, userId ? { userId } : "skip");

  if (!userId) {
    return <EmptyState message="Listelerini görmek için giriş yapmalısın" />;
  }

  if (!userEvents?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-lg font-medium">No events found</h3>
        <p className="text-sm text-muted-foreground">You haven&apos;t added any events to your list yet.</p>
      </div>
    );
  }

  const validUserEvents = userEvents.filter((event): event is UserEventWithActivity => event.activity !== null);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {validUserEvents.map((userEvent) => (
        <EventCard key={userEvent._id} userEvent={userEvent} onUpdate={() => {}} />
      ))}
    </div>
  );
}
