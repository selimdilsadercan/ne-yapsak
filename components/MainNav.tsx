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
    <nav className="sticky bottom-0 left-0 right-0 z-50 bg-white border-t">
      <div className="flex items-center justify-around py-3">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn("flex flex-col items-center gap-1.5 text-xs transition-colors", isActive ? "text-primary" : "text-muted-foreground")}
            >
              <Icon className={cn("h-6 w-6", isActive && "text-primary")} />
              <span>{route.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export { MainNav };
