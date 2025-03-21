"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Film, Tv, Gamepad2, MapPin, CalendarDays, Settings, Users, ListTodo } from "lucide-react";
import AdminGuard from "@/components/auth/AdminGuard";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    name: "Lists",
    href: "/admin/lists",
    icon: ListTodo
  },
  {
    name: "Movies",
    href: "/admin/movies",
    icon: Film
  },
  {
    name: "Series",
    href: "/admin/series",
    icon: Tv
  },
  {
    name: "Games",
    href: "/admin/games",
    icon: Gamepad2
  },
  {
    name: "Places",
    href: "/admin/places",
    icon: MapPin
  },
  {
    name: "Activities",
    href: "/admin/activities",
    icon: CalendarDays
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AdminGuard>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col fixed inset-y-0">
          <div className="flex flex-col flex-grow border-r bg-background px-4 py-5">
            <div className="flex-1">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col md:pl-64">
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
