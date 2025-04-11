"use client";

import { Card } from "@/components/ui/card";

function CalendarPreview() {
  return (
    <Card className="p-8 bg-white border-[#E5E5E5]">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-[#1A1A1A]">Kolay Takvim Senkronizasyonu</h2>
          <p className="text-[#666666] mb-6">
            Mevcut takviminizle otomatik senkronizasyon sayesinde müsait olduğunuz zamanları kolayca paylaşın ve ortak buluşma zamanını anında belirleyin.
          </p>
          <div className="flex gap-4">
            <div className="h-3 w-3 rounded-full bg-[#FF4405]" />
            <div className="h-3 w-3 rounded-full bg-[#FF4405]/60" />
            <div className="h-3 w-3 rounded-full bg-[#FF4405]/30" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 31 }, (_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg ${
                [5, 12, 19, 26].includes(i) ? "bg-[#FF4405] text-white" : "bg-[#F5F5F5] text-[#1A1A1A]"
              } flex items-center justify-center text-sm font-medium`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export { CalendarPreview };
