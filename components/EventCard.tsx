import { format } from "date-fns";
import { Calendar, Star, Trash2 } from "lucide-react";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Doc } from "../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import toast from "react-hot-toast";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
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
} from "./ui/alert-dialog";

interface EventCardProps {
  userEvent: Doc<"userEvents"> & {
    activity: Doc<"activities">;
  };
  onUpdate: () => void;
}

export function EventCard({ userEvent, onUpdate }: EventCardProps) {
  const remove = useMutation(api.userEvents.remove);
  const IconComponent = (Icons[userEvent.activity.iconName as keyof typeof Icons] as LucideIcon) || Icons.HelpCircle;

  const handleDelete = async () => {
    try {
      await remove({ userEventId: userEvent._id });
      onUpdate();
      toast.success("Event has been removed from your list");
    } catch (error) {
      toast.error(`Failed to remove event: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border">
            <IconComponent className="h-4 w-4" />
          </div>
          {userEvent.activity.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {userEvent.date ? format(userEvent.date, "PPP") : "No date set"}
        </div>
        {userEvent.userRating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4" />
            {userEvent.userRating}/5
          </div>
        )}
        {userEvent.notes && <p className="text-sm text-muted-foreground">{userEvent.notes}</p>}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>This will remove the event from your list. This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
