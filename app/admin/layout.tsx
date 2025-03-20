"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Gamepad2, Settings, Activity, Film, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminGuard from "@/components/auth/AdminGuard";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

function SidebarItem({ icon, label, href, isActive }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent", isActive ? "bg-accent" : "transparent")}
    >
      {icon}
      {label}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const sidebarItems = [
    {
      icon: <LayoutDashboard className="w-4 h-4" />,
      label: "Dashboard",
      href: "/admin"
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Users",
      href: "/admin/users"
    },
    {
      icon: <Activity className="w-4 h-4" />,
      label: "Activities",
      href: "/admin/activities"
    },
    {
      icon: <Gamepad2 className="w-4 h-4" />,
      label: "Games",
      href: "/admin/games"
    },
    {
      icon: <Film className="w-4 h-4" />,
      label: "Movies",
      href: "/admin/movies"
    },
    {
      icon: <Tv className="w-4 h-4" />,
      label: "Series",
      href: "/admin/series"
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: "Settings",
      href: "/admin/settings"
    }
  ];

  return (
    <AdminGuard>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <aside className="w-64 border-r">
          <div className="flex h-full flex-col px-3 py-4">
            {/* Logo/Header */}
            <div className="mb-8 px-3">
              <h1 className="text-lg font-semibold">Admin Panel</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
              {sidebarItems.map((item) => (
                <SidebarItem key={item.href} icon={item.icon} label={item.label} href={item.href} isActive={pathname === item.href} />
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </AdminGuard>
  );
}
