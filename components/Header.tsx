import Link from "next/link";
import NotificationsPopover from "./NotificationsPopover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

function Header() {
  const { user } = useUser();

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Temporary Logo */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">W</span>
          </div>
          <Link href="/home" className="text-xl font-bold">
            wedo
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsPopover />
          <Button variant="ghost" size="icon" asChild className="h-10 w-10 rounded-full p-0">
            <Link href="/profile">
              <Avatar>
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || "Profile"} />
                <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
