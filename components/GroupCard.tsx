import { Doc } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

interface GroupCardProps {
  group: Doc<"groups">;
}

export function GroupCard({ group }: GroupCardProps) {
  const router = useRouter();

  return (
    <Card className="w-full hover:bg-accent/50 cursor-pointer transition-colors" onClick={() => router.push(`/groups/${group._id}`)}>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={group.imageUrl} />
          <AvatarFallback>{group.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{group.name}</h3>
          {group.description && <p className="text-sm text-muted-foreground">{group.description}</p>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{group.memberCount} members</span>
        </div>
      </CardContent>
    </Card>
  );
}
