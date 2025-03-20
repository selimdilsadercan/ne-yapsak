import { format } from "date-fns";
import { Calendar, Clock, Star, Trash2 } from "lucide-react";
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

interface ActivityCardProps {
  userActivity: Doc<"userActivities"> & {
    activity: Doc<"activities">;
  };
  onUpdate: () => void;
}

export function ActivityCard({ userActivity, onUpdate }: ActivityCardProps) {
  const remove = useMutation(api.userActivities.remove);

  const handleDelete = async () => {
    try {
      await remove({ userActivityId: userActivity._id });
      onUpdate();
      toast.success("Activity has been removed from your list");
    } catch (error) {
      toast.error(`Failed to remove activity: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border">{userActivity.activity.iconName}</div>
          {userActivity.activity.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {userActivity.lastDoneAt && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Last done: {format(userActivity.lastDoneAt, "PPP")}
          </div>
        )}
        {userActivity.frequency && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Frequency: {userActivity.frequency}
          </div>
        )}
        {userActivity.userRating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4" />
            {userActivity.userRating}/5
          </div>
        )}
        {userActivity.notes && <p className="text-sm text-muted-foreground">{userActivity.notes}</p>}
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
              <AlertDialogDescription>This will remove the activity from your list. This action cannot be undone.</AlertDialogDescription>
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
