"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User2, Users2, ListTodo, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

function MobileNavbar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home
    },
    {
      label: "Discover",
      href: "/discover",
      icon: Compass
    },
    {
      label: "Social",
      href: "/social",
      icon: Users2
    },
    {
      label: "Plans",
      href: "/plans",
      icon: ListTodo
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User2
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-3 py-2 text-sm transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export { MobileNavbar };
