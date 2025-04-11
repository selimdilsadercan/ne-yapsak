"use client";

import { useClerk, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function LandingNav() {
  const { openWaitlist } = useClerk();
  const { isSignedIn } = useAuth();

  return (
    <nav className="w-full py-4 px-4 md:px-6 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Temporary Logo */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">W</span>
          </div>
          <span className="text-xl font-semibold">wedo</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => (window.location.href = "#features")} className="text-gray-600 hover:text-gray-900">
            Özellikler
          </button>
          <button onClick={() => (window.location.href = "#pricing")} className="text-gray-600 hover:text-gray-900">
            Planlar
          </button>
          <button onClick={() => (window.location.href = "#testimonials")} className="text-gray-600 hover:text-gray-900">
            Yorumlar
          </button>
        </div>

        {isSignedIn ? (
          <Button asChild>
            <Link href="/home">Dashboard</Link>
          </Button>
        ) : (
          <Button onClick={() => openWaitlist({ afterJoinWaitlistUrl: "/home" })}>Erken Erişim'e Katıl</Button>
        )}
      </div>
    </nav>
  );
}

export { LandingNav };
