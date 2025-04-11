"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

function JoinBanner() {
  const { openWaitlist } = useClerk();

  return (
    <div className="bg-[#1A1A1A] py-20">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Etkinlik Planlamanın Yeni Yolu</h2>
        <p className="text-lg md:text-xl text-[#E5E5E5] mb-12">
          Arkadaşlarınızla buluşmayı planlamak artık çok daha kolay. Hemen Wedo'ya katılın ve etkinliklerinizi zahmetsizce organize edin.
        </p>
        <Button
          size="lg"
          className="bg-[#FF4405] text-white hover:bg-[#FF4405]/90 font-semibold text-lg px-8"
          onClick={() => openWaitlist({ afterJoinWaitlistUrl: "/" })}
        >
          Beta'ya Katıl
        </Button>
      </div>
    </div>
  );
}

export { JoinBanner };
