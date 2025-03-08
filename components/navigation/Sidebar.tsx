"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User2, Users2, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home
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
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r bg-background p-4 md:block">
      <div className="flex h-full flex-col gap-8">
        <div className="flex items-center gap-2 px-2">
          <span className="text-xl font-semibold">Ne Yapsak?</span>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export { Sidebar };
