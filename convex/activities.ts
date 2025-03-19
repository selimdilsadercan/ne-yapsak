import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all activities
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("activities").collect();
  }
});

// Get activities by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("activities")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  }
});

// Get random activities (for the swipe feature)
export const getRandomActivities = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    const allActivities = await ctx.db.query("activities").collect();
    const shuffled = allActivities.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, args.limit);
  }
});

// Add a new activity
export const add = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    iconName: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", args);
  }
});

// Seed initial activities from activities.md
export const seedActivities = mutation({
  handler: async (ctx) => {
    const activities = [
      // Bir Şeyler İzlemek
      {
        name: "Film",
        category: "Bir Şeyler İzlemek",
        iconName: "Film"
      },
      {
        name: "Dizi",
        category: "Bir Şeyler İzlemek",
        iconName: "Tv"
      },
      {
        name: "YouTube",
        category: "Bir Şeyler İzlemek",
        iconName: "Youtube"
      },
      {
        name: "Belgesel",
        category: "Bir Şeyler İzlemek",
        iconName: "Video"
      },
      {
        name: "Stand-up",
        category: "Bir Şeyler İzlemek",
        iconName: "Mic2"
      },
      {
        name: "Anime",
        category: "Bir Şeyler İzlemek",
        iconName: "Ghost"
      },
      {
        name: "Twitch yayını",
        category: "Bir Şeyler İzlemek",
        iconName: "Radio"
      },

      // Bir Şeyler Oynamak
      {
        name: "Bilgisayar oyunu",
        category: "Bir Şeyler Oynamak",
        iconName: "Gamepad2"
      },
      {
        name: "Konsol oyunu",
        category: "Bir Şeyler Oynamak",
        iconName: "Gamepad2"
      },
      {
        name: "Masa oyunu",
        category: "Bir Şeyler Oynamak",
        iconName: "Dices"
      },
      {
        name: "Flash oyun",
        category: "Bir Şeyler Oynamak",
        iconName: "Gamepad2"
      },
      {
        name: "Mobil oyun",
        category: "Bir Şeyler Oynamak",
        iconName: "Smartphone"
      },
      {
        name: "Bulmaca / Zeka oyunu",
        category: "Bir Şeyler Oynamak",
        iconName: "Puzzle"
      },
      {
        name: "Kart oyunu",
        category: "Bir Şeyler Oynamak",
        iconName: "Dices"
      },

      // Bir Etkinliğe Gitmek
      {
        name: "Tiyatro",
        category: "Bir Etkinliğe Gitmek",
        iconName: "Theater"
      },
      {
        name: "Sinema",
        category: "Bir Etkinliğe Gitmek",
        iconName: "Ticket"
      },
      {
        name: "Opera",
        category: "Bir Etkinliğe Gitmek",
        iconName: "Music2"
      },
      {
        name: "Konser",
        category: "Bir Etkinliğe Gitmek",
        iconName: "Music2"
      },
      {
        name: "Spor maçı",
        category: "Bir Etkinliğe Gitmek",
        iconName: "Trophy"
      },
      {
        name: "Festival",
        category: "Bir Etkinliğe Gitmek",
        iconName: "PartyPopper"
      },
      {
        name: "Sergi / Sanat galerisi",
        category: "Bir Etkinliğe Gitmek",
        iconName: "PaintBucket"
      },
      {
        name: "Workshop / Atölye",
        category: "Bir Etkinliğe Gitmek",
        iconName: "GraduationCap"
      },
      {
        name: "Açık hava etkinliği",
        category: "Bir Etkinliğe Gitmek",
        iconName: "Tent"
      },

      // Bir Yere Gitmek
      {
        name: "Cafe",
        category: "Bir Yere Gitmek",
        iconName: "Coffee"
      },
      {
        name: "Restoran",
        category: "Bir Yere Gitmek",
        iconName: "UtensilsCrossed"
      },
      {
        name: "Bar / Pub",
        category: "Bir Yere Gitmek",
        iconName: "Beer"
      },
      {
        name: "Piknik alanı",
        category: "Bir Yere Gitmek",
        iconName: "Trees"
      },
      {
        name: "Lunapark / Eğlence parkı",
        category: "Bir Yere Gitmek",
        iconName: "CirclePlay"
      },
      {
        name: "Müze",
        category: "Bir Yere Gitmek",
        iconName: "Building"
      },
      {
        name: "Kitapçı",
        category: "Bir Yere Gitmek",
        iconName: "BookOpen"
      },
      {
        name: "Kütüphane",
        category: "Bir Yere Gitmek",
        iconName: "Library"
      },
      {
        name: "Sahil / Deniz kenarı",
        category: "Bir Yere Gitmek",
        iconName: "Waves"
      },
      {
        name: "Dağ / Doğa alanı",
        category: "Bir Yere Gitmek",
        iconName: "Mountain"
      },
      {
        name: "AVM / Mağaza gezisi",
        category: "Bir Yere Gitmek",
        iconName: "ShoppingBag"
      },
      {
        name: "Hayvanat bahçesi / Akvaryum",
        category: "Bir Yere Gitmek",
        iconName: "Fish"
      },

      // Sosyal ve Eğlenceli Aktiviteler
      {
        name: "Karaoke yapmak",
        category: "Sosyal ve Eğlenceli Aktiviteler",
        iconName: "Mic"
      },
      {
        name: "Escape room (kaçış oyunu)",
        category: "Sosyal ve Eğlenceli Aktiviteler",
        iconName: "KeyRound"
      },
      {
        name: "Paintball / Lazer tag",
        category: "Sosyal ve Eğlenceli Aktiviteler",
        iconName: "Target"
      },
      {
        name: "Bowling / Bilardo",
        category: "Sosyal ve Eğlenceli Aktiviteler",
        iconName: "CircleDot"
      },
      {
        name: "Masa tenisi / Air hockey",
        category: "Sosyal ve Eğlenceli Aktiviteler",
        iconName: "Dice1"
      },
      {
        name: "Gece yürüyüşü / Şehir keşfi",
        category: "Sosyal ve Eğlenceli Aktiviteler",
        iconName: "Moon"
      },
      {
        name: "Fotoğraf çekim turu",
        category: "Sosyal ve Eğlenceli Aktiviteler",
        iconName: "Camera"
      },
      {
        name: "Kamp ateşi / Mangal",
        category: "Sosyal ve Eğlenceli Aktiviteler",
        iconName: "Flame"
      },

      // Hobiler ve Kendine Zaman Ayırma
      {
        name: "Kitap okumak",
        category: "Hobiler ve Kendine Zaman Ayırma",
        iconName: "Book"
      },
      {
        name: "Podcast dinlemek",
        category: "Hobiler ve Kendine Zaman Ayırma",
        iconName: "Headphones"
      },
      {
        name: "Müzik yapmak / dinlemek",
        category: "Hobiler ve Kendine Zaman Ayırma",
        iconName: "Music"
      },
      {
        name: "Çizim / Boyama yapmak",
        category: "Hobiler ve Kendine Zaman Ayırma",
        iconName: "Palette"
      },
      {
        name: "Fotoğraf çekmek",
        category: "Hobiler ve Kendine Zaman Ayırma",
        iconName: "Camera"
      },
      {
        name: "Günlük / Blog yazmak",
        category: "Hobiler ve Kendine Zaman Ayırma",
        iconName: "PenTool"
      },
      {
        name: "El işi / DIY projeleri",
        category: "Hobiler ve Kendine Zaman Ayırma",
        iconName: "Scissors"
      },
      {
        name: "Günlük tutmak / Bullet journal",
        category: "Hobiler ve Kendine Zaman Ayırma",
        iconName: "ScrollText"
      },

      // Dış Mekan Aktiviteleri
      {
        name: "Doğa yürüyüşü / Trekking",
        category: "Dış Mekan Aktiviteleri",
        iconName: "Compass"
      },
      {
        name: "Bisiklete binmek",
        category: "Dış Mekan Aktiviteleri",
        iconName: "Bike"
      },
      {
        name: "Spor salonuna gitmek",
        category: "Dış Mekan Aktiviteleri",
        iconName: "Dumbbell"
      },
      {
        name: "Yüzmek",
        category: "Dış Mekan Aktiviteleri",
        iconName: "Droplets"
      },
      {
        name: "Yoga / Meditasyon",
        category: "Dış Mekan Aktiviteleri",
        iconName: "Flower2"
      },
      {
        name: "Kamp yapmak",
        category: "Dış Mekan Aktiviteleri",
        iconName: "Tent"
      },
      {
        name: "Balık tutmak",
        category: "Dış Mekan Aktiviteleri",
        iconName: "Fish"
      },
      {
        name: "Kaykay / Paten sürmek",
        category: "Dış Mekan Aktiviteleri",
        iconName: "PersonStanding"
      },
      {
        name: "Koşu yapmak",
        category: "Dış Mekan Aktiviteleri",
        iconName: "PersonStanding"
      },
      {
        name: "Dağa tırmanış / Bouldering",
        category: "Dış Mekan Aktiviteleri",
        iconName: "Mountain"
      },
      {
        name: "Tenis / Badminton / Squash",
        category: "Dış Mekan Aktiviteleri",
        iconName: "CircleDot"
      },
      {
        name: "Basketbol / Futbol / Voleybol",
        category: "Dış Mekan Aktiviteleri",
        iconName: "Trophy"
      },

      // Kendi Kendine Yapılabilecek Aktiviteler
      {
        name: "Yeni bir yemek tarifi denemek",
        category: "Kendi Kendine Yapılabilecek Aktiviteler",
        iconName: "ChefHat"
      },
      {
        name: "Origami / El sanatları yapmak",
        category: "Kendi Kendine Yapılabilecek Aktiviteler",
        iconName: "Scissors"
      },
      {
        name: "Kod yazmak / Proje geliştirmek",
        category: "Kendi Kendine Yapılabilecek Aktiviteler",
        iconName: "Code2"
      },
      {
        name: "Yeni bir dil öğrenmek",
        category: "Kendi Kendine Yapılabilecek Aktiviteler",
        iconName: "Languages"
      },
      {
        name: "Puzzle / Yapboz çözmek",
        category: "Kendi Kendine Yapılabilecek Aktiviteler",
        iconName: "Puzzle"
      },
      {
        name: "Enstrüman çalmayı öğrenmek",
        category: "Kendi Kendine Yapılabilecek Aktiviteler",
        iconName: "Piano"
      },
      {
        name: "Kendi hikayeni yazmak",
        category: "Kendi Kendine Yapılabilecek Aktiviteler",
        iconName: "FileText"
      },
      {
        name: "Astroloji / Tarot / Fal bakmak",
        category: "Kendi Kendine Yapılabilecek Aktiviteler",
        iconName: "Stars"
      },
      {
        name: "Kendi podcastini kaydetmek",
        category: "Kendi Kendine Yapılabilecek Aktiviteler",
        iconName: "Podcast"
      },
      {
        name: "Lego / Maket yapmak",
        category: "Kendi Kendine Yapılabilecek Aktiviteler",
        iconName: "Blocks"
      },
      {
        name: "Çeşitli challenge'lar denemek",
        category: "Kendi Kendine Yapılabilecek Aktiviteler",
        iconName: "Medal"
      }
    ];

    // Insert all activities
    for (const activity of activities) {
      await ctx.db.insert("activities", activity);
    }

    return "Activities seeded successfully";
  }
});
