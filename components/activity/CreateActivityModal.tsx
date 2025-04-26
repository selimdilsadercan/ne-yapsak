import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "react-hot-toast";
import { PlusCircle } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { LucideIconSelectorDialog } from "@/components/dialogs/LucideIconSelectorDialog";

interface CreateActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (id: Id<"activities">) => void;
  activity?: any;
}

export function CreateActivityModal({ open, onOpenChange, onCreated, activity }: CreateActivityModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Bir Aktivite Yapmak");
  const [iconName, setIconName] = useState("CircleDot");
  const [showIconDialog, setShowIconDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const createActivity = useMutation(api.activities.add);
  const updateActivity = useMutation(api.activities.update);

  // Pre-fill fields if editing
  useEffect(() => {
    if (activity) {
      setName(activity.name || "");
      setCategory(activity.category || "Bir Aktivite Yapmak");
      setIconName(activity.iconName || "CircleDot");
    } else {
      setName("");
      setCategory("Bir Aktivite Yapmak");
      setIconName("CircleDot");
    }
  }, [activity, open]);

  // Infer contentType from category
  function inferContentType(category: string): string {
    if (category === "Bir Şeyler İzlemek") return "video";
    if (category === "Bir Şeyler Oynamak") return "game";
    if (category === "Bir Etkinliğe Gitmek") return "event";
    if (category === "Bir Yere Gitmek") return "place";
    return "activity";
  }

  const handleSave = async () => {
    if (!name) return;
    setLoading(true);
    try {
      if (activity) {
        await updateActivity({
          id: activity._id,
          name,
          category,
          iconName,
          contentType: inferContentType(category)
        });
        toast.success("Activity updated!");
        onCreated?.(activity._id);
      } else {
        const id = await createActivity({
          name,
          category,
          iconName,
          contentType: inferContentType(category)
        });
        toast.success("Activity created!");
        onCreated?.(id);
      }
      onOpenChange(false);
    } catch (e) {
      toast.error(activity ? "Failed to update activity" : "Failed to create activity");
    } finally {
      setLoading(false);
    }
  };

  // Dynamically get the icon component
  const LucideIcon = (iconName && (require("lucide-react")[iconName] as React.FC<{ className?: string }>)) || require("lucide-react").CircleDot;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>{activity ? "Edit Activity" : "Create New Activity"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Name*" value={name} onChange={(e) => setName(e.target.value)} className="w-full" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
          >
            <option value="Bir Aktivite Yapmak">Bir Aktivite Yapmak</option>
            <option value="Bir Şeyler İzlemek">Bir Şeyler İzlemek</option>
            <option value="Bir Şeyler Oynamak">Bir Şeyler Oynamak</option>
            <option value="Bir Etkinliğe Gitmek">Bir Etkinliğe Gitmek</option>
            <option value="Bir Yere Gitmek">Bir Yere Gitmek</option>
          </select>
          <Button type="button" variant="outline" className="w-full flex items-center gap-2" onClick={() => setShowIconDialog(true)}>
            <LucideIcon className="w-5 h-5" />
            <span>{iconName}</span>
            <span className="ml-auto text-xs text-muted-foreground">Change Icon</span>
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!name || loading} className="w-full mt-2">
            <PlusCircle className="w-4 h-4 mr-2" /> {activity ? "Update" : "Save"}
          </Button>
        </DialogFooter>
        <LucideIconSelectorDialog open={showIconDialog} onOpenChange={setShowIconDialog} onSelect={(icon) => setIconName(icon)} />
      </DialogContent>
    </Dialog>
  );
}
