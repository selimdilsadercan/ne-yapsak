"use client";

import { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

function ConfirmDialog({ trigger, title, description, onConfirm, confirmText = "Confirm", cancelText = "Cancel", variant = "default" }: ConfirmDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={(e) => {
              const dialogTrigger = (e.target as HTMLElement).closest("div[role='dialog']")?.parentElement?.querySelector("[data-state]");
              if (dialogTrigger instanceof HTMLElement) dialogTrigger.click();
            }}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={(e) => {
              onConfirm();
              const dialogTrigger = (e.target as HTMLElement).closest("div[role='dialog']")?.parentElement?.querySelector("[data-state]");
              if (dialogTrigger instanceof HTMLElement) dialogTrigger.click();
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmDialog };
