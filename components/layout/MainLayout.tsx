"use client";

import { useAuth } from "@clerk/nextjs";
import { MobileNavbar } from "@/components/navigation/MobileNavbar";
import { Sidebar } from "@/components/navigation/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return children;
  }

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 md:pl-64">
          <div className="container mx-auto p-4 pb-20 md:pb-4">{children}</div>
        </main>
        <MobileNavbar />
      </div>
    </>
  );
}

export { MainLayout };
