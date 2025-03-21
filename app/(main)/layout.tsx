"use client";

import { useAuth } from "@clerk/nextjs";
import { MainNav } from "@/components/MainNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return children;
  } 

  return (
    <>
      <main className="min-h-screen">
        <div className="container mx-auto p-4 pb-20">{children}</div>
      </main>
      <MainNav />
    </>
  );
}
