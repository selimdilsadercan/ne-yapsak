"use client";

import { ListCard } from "@/components/ListCard";
import { DefaultListCard } from "@/components/DefaultListCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Film, Gamepad2, MapPin, PartyPopper, Activity } from "lucide-react";

const defaultLists = [
  {
    id: "watch",
    title: "Bir Şeyler İzlemek",
    description: "Film ve diziler",
    icon: Film,
    href: "/list?type=watch"
  },
  {
    id: "game",
    title: "Bir Şeyler Oynamak",
    description: "Video oyunları",
    icon: Gamepad2,
    href: "/list?type=game"
  },
  {
    id: "visit",
    title: "Bir Yere Gitmek",
    description: "Mekanlar ve yerler",
    icon: MapPin,
    href: "/list?type=visit"
  },
  {
    id: "event",
    title: "Bir Etkinliğe Gitmek",
    description: "Konser, tiyatro ve daha fazlası",
    icon: PartyPopper,
    href: "/list?type=event"
  },
  {
    id: "activity",
    title: "Bir Aktivite Yapmak",
    description: "Yapabileceğiniz her şey",
    icon: Activity,
    href: "/list?type=activity"
  }
];

function HomePage() {
  const suggestedLists = useQuery(api.lists.getSuggestedLists);

  if (!suggestedLists) {
    return (
      <div className="container flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Yükleniyor...</h1>
      </div>
    );
  }

  return (
    <div className="container space-y-12 py-6">
      {/* Default Lists Section */}
      <section>
        <h1 className="mb-6 text-2xl font-bold">Bugün Ne Yapmak İstersin?</h1>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {defaultLists.map((list) => (
            <DefaultListCard key={list.id} title={list.title} description={list.description} icon={list.icon} href={list.href} className="p-3 sm:p-4" />
          ))}
        </div>
      </section>

      {/* Suggested Lists Section */}
      {suggestedLists.length > 0 && (
        <section>
          <h2 className="mb-6 text-2xl font-bold">Listeler</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {suggestedLists.map((list) => (
              <ListCard key={list.id} title={list.title} description={list.description} imageUrl={list.imageUrl} href={list.href} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;
