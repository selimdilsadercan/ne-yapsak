import { LandingNav } from "@/components/layout/LandingNav";
import { Vote, Clock, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EventListPreview } from "@/components/landing/EventListPreview";
import { CalendarPreview } from "@/components/landing/CalendarPreview";
import { JoinBanner } from "@/components/landing/JoinBanner";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />

      <main className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between py-16 md:py-24">
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <div className="inline-block mb-3 px-4 py-1.5 bg-[#1A1A1A] rounded-full">
              <span className="text-white text-sm font-medium">Yeni Nesil Etkinlik Planlama</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1A1A1A]">Arkadaşlarla Buluşmak Artık Çok Daha Kolay</h1>
            <p className="mt-6 text-lg md:text-xl text-[#666666]">
              Etkinliklerinizi demokratik bir şekilde planlayın, oylayın ve herkesin katılabileceği en uygun zamanı tek tıkla belirleyin.
            </p>
          </div>

          {/* Mock UI Component */}
          <div className="flex-1 mt-12 lg:mt-0">
            <EventListPreview />
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1A1A1A]">Özellikler</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-[#E5E5E5]">
              <Vote className="h-12 w-12 text-[#FF4405] mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">Demokratik Planlama</h3>
              <p className="text-[#666666]">Etkinlik detaylarını herkesin katılımıyla belirleyin</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-[#E5E5E5]">
              <Clock className="h-12 w-12 text-[#FF4405] mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">Akıllı Zamanlama</h3>
              <p className="text-[#666666]">Herkesin müsait olduğu zamanı otomatik olarak belirleyin</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-[#E5E5E5]">
              <Star className="h-12 w-12 text-[#FF4405] mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">Etkinlik Önerileri</h3>
              <p className="text-[#666666]">Grubunuza özel kişiselleştirilmiş aktivite önerileri alın</p>
            </Card>
          </div>
        </section>

        {/* Calendar Preview Section */}
        <section className="py-20">
          <CalendarPreview />
        </section>
      </main>

      {/* Join Banner */}
      <JoinBanner />
    </div>
  );
}
