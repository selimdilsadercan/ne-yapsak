"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { MainNav } from "@/components/MainNav";
import { SignInPrompt } from "@/components/SignInPrompt";
import Header from "@/components/Header";

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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-screen-xl px-4 py-6">{children}</main>
      <div className="sticky bottom-0 left-0 right-0 bg-background border-t">{!isGroupDetailPage && <MainNav />}</div>
    </div>
  );
}
