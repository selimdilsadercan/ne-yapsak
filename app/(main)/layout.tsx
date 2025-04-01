"use client";

import { useAuth } from "@clerk/nextjs";
import { MainNav } from "@/components/MainNav";
import { SignInPrompt } from "@/components/SignInPrompt";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <SignInPrompt />;
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <main className="flex-1 px-4">
        <div className="max-w-screen-xl mx-auto">{children}</div>
      </main>
      <div className="fixed bottom-0 left-0 right-0">
        <MainNav />
      </div>
    </div>
  );
}
