"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ListForm } from "./ListForm";
import { Doc } from "@/convex/_generated/dataModel";

interface EditListDialogProps {
  list: Doc<"lists">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditListDialog({ list, open, onOpenChange }: EditListDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit List</DialogTitle>
        </DialogHeader>
        <ListForm initialData={list} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
