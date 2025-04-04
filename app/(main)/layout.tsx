"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { MainNav } from "@/components/MainNav";
import { SignInPrompt } from "@/components/SignInPrompt";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const isGroupDetailPage = pathname.startsWith("/groups/") && pathname !== "/groups";

  if (!isSignedIn) {
    return <SignInPrompt />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-4">
        <div className="max-w-screen-xl mx-auto">{children}</div>
      </main>
      {!isGroupDetailPage && <MainNav />}
    </div>
  );
}
