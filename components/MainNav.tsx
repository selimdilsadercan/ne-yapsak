"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Compass, ListTodo, User } from "lucide-react";

const routes = [
  {
    href: "/",
    label: "Ana Sayfa",
    icon: Home
  },
  {
    href: "/discover",
    label: "Keşfet",
    icon: Compass
  },
  {
    href: "/library",
    label: "Kitaplığın",
    icon: ListTodo
  },
  {
    href: "/profile",
    label: "Profil",
    icon: User
  }
];

function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="container flex items-center justify-around py-2">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 text-sm transition-colors hover:text-primary",
                pathname === route.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{route.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export { MainNav };
