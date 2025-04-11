"use client";

import { CalendarDays, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function EventListPreview() {
  return (
    <Card className="p-6 shadow-lg bg-white border-[#E5E5E5]">
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 bg-[#F5F5F5] rounded-lg">
          <Users2 className="h-10 w-10 text-[#FF4405]" />
          <div>
            <h3 className="font-semibold text-[#1A1A1A]">Kahve Molası</h3>
            <p className="text-sm text-[#666666]">4 kişi katılıyor</p>
          </div>
          <Button size="sm" variant="outline" className="ml-auto border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F5F5F5]">
            Katıl
          </Button>
        </div>

        <div className="flex items-center gap-4 p-3 bg-[#F5F5F5] rounded-lg">
          <CalendarDays className="h-10 w-10 text-[#FF4405]" />
          <div>
            <h3 className="font-semibold text-[#1A1A1A]">Akşam Yemeği</h3>
            <p className="text-sm text-[#666666]">6 kişi katılıyor</p>
          </div>
          <Button size="sm" variant="outline" className="ml-auto border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F5F5F5]">
            Katıl
          </Button>
        </div>
      </div>
    </Card>
  );
}

export { EventListPreview };
