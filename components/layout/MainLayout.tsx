"use client";

import { useAuth } from "@clerk/nextjs";

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return children;
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto p-4 pb-20">{children}</div>
    </main>
  );
}

export { MainLayout };
