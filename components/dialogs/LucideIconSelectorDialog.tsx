import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";

interface LucideIconSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (iconName: string) => void;
}

const ICONS = Object.keys(Icons).filter(
  (name) =>
    typeof Icons[name as keyof typeof Icons] === "function" && /^[A-Z][a-zA-Z0-9]*$/.test(name) && (Icons[name as keyof typeof Icons] as any).displayName
);

export function LucideIconSelectorDialog({ open, onOpenChange, onSelect }: LucideIconSelectorDialogProps) {
  const [search, setSearch] = useState("");

  const filteredIcons = useMemo(() => {
    if (!search.trim()) return ICONS;
    return ICONS.filter((name) => name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Select Icon</DialogTitle>
        </DialogHeader>
        <Input placeholder="Search icons..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4" />
        <div className="grid grid-cols-6 gap-4 min-h-[200px] border-t pt-4 max-h-96 overflow-y-auto">
          {filteredIcons.length > 0
            ? filteredIcons.map((name) => {
                const IconComponent = Icons[name as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
                return (
                  <Button
                    key={name}
                    variant="ghost"
                    className="flex flex-col items-center justify-center p-2 hover:bg-accent"
                    onClick={() => {
                      onSelect(name);
                      onOpenChange(false);
                    }}
                  >
                    <IconComponent className="w-6 h-6 mb-1" />
                    <span className="text-xs truncate">{name}</span>
                  </Button>
                );
              })
            : search.trim() && <div className="col-span-6 flex items-center justify-center text-muted-foreground h-full min-h-[120px]">No icons found</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LucideIconSelectorDialog;
