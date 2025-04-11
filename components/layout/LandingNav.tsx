"use client";

import { useClerk, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function LandingNav() {
  const { openWaitlist } = useClerk();
  const { isSignedIn } = useAuth();

  return (
    <nav className="w-full py-4 px-4 md:px-6 border-[#E5E5E5] bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF4405]">
            <span className="text-lg font-bold text-white">W</span>
          </div>
          <span className="text-xl font-semibold text-[#1A1A1A]">wedo</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => (window.location.href = "#features")} className="text-[#666666] hover:text-[#1A1A1A] transition-colors">
            Özellikler
          </button>
          <button onClick={() => (window.location.href = "#how-it-works")} className="text-[#666666] hover:text-[#1A1A1A] transition-colors">
            Nasıl Çalışır
          </button>
          <button onClick={() => (window.location.href = "#calendar")} className="text-[#666666] hover:text-[#1A1A1A] transition-colors">
            Takvim
          </button>
        </div>

        {isSignedIn ? (
          <Button asChild className="bg-[#FF4405] text-white hover:bg-[#FF4405]/90">
            <Link href="/home">Etkinliklerim</Link>
          </Button>
        ) : (
          <Button onClick={() => openWaitlist({ afterJoinWaitlistUrl: "/home" })} className="bg-[#FF4405] text-white hover:bg-[#FF4405]/90">
            Beta'ya Katıl
          </Button>
        )}
      </div>
    </nav>
  );
}

export { LandingNav };
