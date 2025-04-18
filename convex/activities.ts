import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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
    contentType: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", args);
  }
});

// Clear all activities
export const clearAll = mutation({
  handler: async (ctx) => {
    const activities = await ctx.db.query("activities").collect();
    await Promise.all(activities.map((activity) => ctx.db.delete(activity._id)));
  }
});

// Seed initial activities from activities.md
export const seedActivities = mutation({
  args: {
    force: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Always clear existing activities
    const existingActivities = await ctx.db.query("activities").collect();
    for (const activity of existingActivities) {
      await ctx.db.delete(activity._id);
    }

    const activities = [
      // Bir Şeyler İzlemek
      {
        name: "Film",
        category: "Bir Şeyler İzlemek",
        iconName: "Film",
        contentType: "movie"
      },
      {
        name: "Dizi",
        category: "Bir Şeyler İzlemek",
        iconName: "Tv",
        contentType: "series"
      },
      {
        name: "YouTube",
        category: "Bir Şeyler İzlemek",
        iconName: "Youtube",
        contentType: "video"
      },
      {
        name: "Belgesel",
        category: "Bir Şeyler İzlemek",
        iconName: "Video",
        contentType: "video"
      },
      {
        name: "Stand-up",
        category: "Bir Şeyler İzlemek",
        iconName: "Mic2",
        contentType: "video"
      },
      {
        name: "Anime",
        category: "Bir Şeyler İzlemek",
        iconName: "Ghost",
        contentType: "series"
      },
      {
        name: "Twitch yayını",
        category: "Bir Şeyler İzlemek",
        iconName: "Radio",
        contentType: "video"
      },

      // Bir Şeyler Oynamak
      {
        name: "Bilgisayar oyunu",
        category: "Bir Şeyler Oynamak",
        iconName: "Gamepad2",
        contentType: "game"
      },
      {
        name: "Konsol oyunu",
        category: "Bir Şeyler Oynamak",
        iconName: "Gamepad2",
        contentType: "game"
      },
      {
        name: "Masa oyunu",
        category: "Bir Şeyler Oynamak",
        iconName: "Dices",
        contentType: "game"
      },
      {
        name: "Flash oyun",
        category: "Bir Şeyler Oynamak",
        iconName: "Gamepad2",
        contentType: "game"
      },
      {
        name: "Mobil oyun",
        category: "Bir Şeyler Oynamak",
        iconName: "Smartphone",
        contentType: "game"
      },
      {
        name: "Bulmaca / Zeka oyunu",
        category: "Bir Şeyler Oynamak",
        iconName: "Puzzle",
        contentType: "game"
      },
      {
        name: "Kart oyunu",
        category: "Bir Şeyler Oynamak",
        iconName: "Dices",
        contentType: "game"
      },

      // Bir Etkinliğe Gitmek
      {
        name: "Stand-up",
        category: "Bir Etkinliğe Gitmek",
        iconName: "Mic2",
        contentType: "event"
      },
      {
        name: "Tiyatro",
        category: "Bir Etkinliğe Gitmek",
        iconName: "Theater",
        contentType: "event"
      },
      {
        name: "Sinema",
        category: "Bir Etkinliğe Gitmek",
        iconName: "Ticket",
        contentType: "event"
      },
      {
        name: "Opera",
        category: "Bir Etkinliğe Gitmek",
        iconName: "Music2",
        contentType: "event"
      },
      {
        name: "Konser",
        category: "Bir Etkinliğe Gitmek",
        iconName: "Music2",
        contentType: "event"
      },
      {
        name: "Spor maçı",
        category: "Bir Etkinliğe Gitmek",
        iconName: "Trophy",
        contentType: "event"
      },
      {
        name: "Festival",
        category: "Bir Etkinliğe Gitmek",
        iconName: "PartyPopper",
        contentType: "event"
      },
      {
        name: "Sergi / Sanat galerisi",
        category: "Bir Etkinliğe Gitmek",
        iconName: "PaintBucket",
        contentType: "event"
      },
      {
        name: "Workshop / Atölye",
        category: "Bir Etkinliğe Gitmek",
        iconName: "GraduationCap",
        contentType: "event"
      },
      {
        name: "Açık hava etkinliği",
        category: "Bir Etkinliğe Gitmek",
        iconName: "Tent",
        contentType: "event"
      },

      // Bir Yere Gitmek
      {
        name: "Cafe",
        category: "Bir Yere Gitmek",
        iconName: "Coffee",
        contentType: "place"
      },
      {
        name: "Restoran",
        category: "Bir Yere Gitmek",
        iconName: "UtensilsCrossed",
        contentType: "place"
      },
      {
        name: "Bar / Pub",
        category: "Bir Yere Gitmek",
        iconName: "Beer",
        contentType: "place"
      },
      {
        name: "Piknik alanı",
        category: "Bir Yere Gitmek",
        iconName: "Trees",
        contentType: "place"
      },
      {
        name: "Lunapark / Eğlence parkı",
        category: "Bir Yere Gitmek",
        iconName: "CirclePlay",
        contentType: "place"
      },
      {
        name: "Müze",
        category: "Bir Yere Gitmek",
        iconName: "Building",
        contentType: "place"
      },
      {
        name: "Kitapçı",
        category: "Bir Yere Gitmek",
        iconName: "BookOpen",
        contentType: "place"
      },
      {
        name: "Kütüphane",
        category: "Bir Yere Gitmek",
        iconName: "Library",
        contentType: "place"
      },
      {
        name: "Sahil / Deniz kenarı",
        category: "Bir Yere Gitmek",
        iconName: "Waves",
        contentType: "place"
      },
      {
        name: "Dağ / Doğa alanı",
        category: "Bir Yere Gitmek",
        iconName: "Mountain",
        contentType: "place"
      },
      {
        name: "AVM / Mağaza gezisi",
        category: "Bir Yere Gitmek",
        iconName: "ShoppingBag",
        contentType: "place"
      },
      {
        name: "Hayvanat bahçesi / Akvaryum",
        category: "Bir Yere Gitmek",
        iconName: "Fish",
        contentType: "place"
      },
      {
        name: "Paintball / Lazer tag",
        category: "Bir Yere Gitmek",
        iconName: "Target",
        contentType: "place"
      },
      {
        name: "Escape room (kaçış oyunu)",
        category: "Bir Yere Gitmek",
        iconName: "KeyRound",
        contentType: "place"
      },
      {
        name: "Karaoke'ye gitmek",
        category: "Bir Yere Gitmek",
        iconName: "Mic",
        contentType: "place"
      },
      {
        name: "Bowling / Bilardo",
        category: "Bir Yere Gitmek",
        iconName: "CircleDot",
        contentType: "place"
      },
      {
        name: "Kamp yapmak",
        category: "Bir Yere Gitmek",
        iconName: "Tent",
        contentType: "place"
      },

      // Bir Aktivite Yapmak
      {
        name: "Masa tenisi / Air hockey",
        category: "Bir Aktivite Yapmak",
        iconName: "CircleDot",
        contentType: "activity"
      },
      {
        name: "Gece yürüyüşü / Şehir keşfi",
        category: "Bir Aktivite Yapmak",
        iconName: "Moon",
        contentType: "activity"
      },
      {
        name: "Fotoğraf çekim turu",
        category: "Bir Aktivite Yapmak",
        iconName: "Camera",
        contentType: "activity"
      },
      {
        name: "Kamp ateşi / Mangal",
        category: "Bir Aktivite Yapmak",
        iconName: "Flame",
        contentType: "activity"
      },
      {
        name: "Kitap okumak",
        category: "Bir Aktivite Yapmak",
        iconName: "Book",
        contentType: "activity"
      },
      {
        name: "Podcast dinlemek",
        category: "Bir Aktivite Yapmak",
        iconName: "Headphones",
        contentType: "activity"
      },
      {
        name: "Müzik yapmak / dinlemek",
        category: "Bir Aktivite Yapmak",
        iconName: "Music",
        contentType: "activity"
      },
      {
        name: "Çizim / Boyama yapmak",
        category: "Bir Aktivite Yapmak",
        iconName: "Palette",
        contentType: "activity"
      },
      {
        name: "Fotoğraf çekmek",
        category: "Bir Aktivite Yapmak",
        iconName: "Camera",
        contentType: "activity"
      },
      {
        name: "Günlük / Blog yazmak",
        category: "Bir Aktivite Yapmak",
        iconName: "PenTool",
        contentType: "activity"
      },
      {
        name: "El işi / DIY projeleri",
        category: "Bir Aktivite Yapmak",
        iconName: "Scissors",
        contentType: "activity"
      },
      {
        name: "Günlük tutmak / Bullet journal",
        category: "Bir Aktivite Yapmak",
        iconName: "ScrollText",
        contentType: "activity"
      },
      {
        name: "Doğa yürüyüşü / Trekking",
        category: "Bir Aktivite Yapmak",
        iconName: "Compass",
        contentType: "activity"
      },
      {
        name: "Bisiklete binmek",
        category: "Bir Aktivite Yapmak",
        iconName: "Bike",
        contentType: "activity"
      },
      {
        name: "Spor salonuna gitmek",
        category: "Bir Aktivite Yapmak",
        iconName: "Dumbbell",
        contentType: "activity"
      },
      {
        name: "Yüzmek",
        category: "Bir Aktivite Yapmak",
        iconName: "Droplets",
        contentType: "activity"
      },
      {
        name: "Yoga / Meditasyon",
        category: "Bir Aktivite Yapmak",
        iconName: "Flower2",
        contentType: "activity"
      },
      {
        name: "Balık tutmak",
        category: "Bir Aktivite Yapmak",
        iconName: "Fish",
        contentType: "activity"
      },
      {
        name: "Kaykay / Paten sürmek",
        category: "Bir Aktivite Yapmak",
        iconName: "PersonStanding",
        contentType: "activity"
      },
      {
        name: "Koşu yapmak",
        category: "Bir Aktivite Yapmak",
        iconName: "PersonStanding",
        contentType: "activity"
      },
      {
        name: "Dağa tırmanış / Bouldering",
        category: "Bir Aktivite Yapmak",
        iconName: "Mountain",
        contentType: "activity"
      },
      {
        name: "Tenis / Badminton / Squash",
        category: "Bir Aktivite Yapmak",
        iconName: "CircleDot",
        contentType: "activity"
      },
      {
        name: "Basketbol / Futbol / Voleybol",
        category: "Bir Aktivite Yapmak",
        iconName: "Trophy",
        contentType: "activity"
      },
      {
        name: "Yeni bir yemek tarifi denemek",
        category: "Bir Aktivite Yapmak",
        iconName: "ChefHat",
        contentType: "activity"
      },
      {
        name: "Origami / El sanatları yapmak",
        category: "Bir Aktivite Yapmak",
        iconName: "Scissors",
        contentType: "activity"
      },
      {
        name: "Kod yazmak / Proje geliştirmek",
        category: "Bir Aktivite Yapmak",
        iconName: "Code2",
        contentType: "activity"
      },
      {
        name: "Yeni bir dil öğrenmek",
        category: "Bir Aktivite Yapmak",
        iconName: "Languages",
        contentType: "activity"
      },
      {
        name: "Puzzle / Yapboz çözmek",
        category: "Bir Aktivite Yapmak",
        iconName: "Puzzle",
        contentType: "activity"
      },
      {
        name: "Enstrüman çalmayı öğrenmek",
        category: "Bir Aktivite Yapmak",
        iconName: "Piano",
        contentType: "activity"
      },
      {
        name: "Kendi hikayeni yazmak",
        category: "Bir Aktivite Yapmak",
        iconName: "FileText",
        contentType: "activity"
      },
      {
        name: "Astroloji / Tarot / Fal bakmak",
        category: "Bir Aktivite Yapmak",
        iconName: "Stars",
        contentType: "activity"
      },
      {
        name: "Kendi podcastini kaydetmek",
        category: "Bir Aktivite Yapmak",
        iconName: "Podcast",
        contentType: "activity"
      },
      {
        name: "Lego / Maket yapmak",
        category: "Bir Aktivite Yapmak",
        iconName: "Blocks",
        contentType: "activity"
      },
      {
        name: "Çeşitli challenge'lar denemek",
        category: "Bir Aktivite Yapmak",
        iconName: "Medal",
        contentType: "activity"
      }
    ];

    // Insert activities one by one
    for (const activity of activities) {
      try {
        await ctx.db.insert("activities", {
          name: activity.name,
          category: activity.category,
          iconName: activity.iconName,
          contentType: activity.contentType
        });
      } catch (error) {
        console.error(`Failed to insert activity: ${activity.name}`, error);
      }
    }

    return "Activities seeded successfully";
  }
});

// Migration to add contentType to existing activities
export const migrateAddContentType = mutation({
  handler: async (ctx) => {
    const activities = await ctx.db.query("activities").collect();

    for (const activity of activities) {
      if (!activity.contentType) {
        let contentType = "activity";

        // Set appropriate contentType based on category
        if (activity.category === "Bir Şeyler İzlemek") {
          if (activity.name === "Film") contentType = "movie";
          else if (["Dizi", "Anime"].includes(activity.name)) contentType = "series";
          else contentType = "video";
        } else if (activity.category === "Bir Şeyler Oynamak") {
          contentType = "game";
        } else if (activity.category === "Bir Etkinliğe Gitmek") {
          contentType = "event";
        } else if (activity.category === "Bir Yere Gitmek") {
          contentType = "place";
        }

        await ctx.db.patch(activity._id, { contentType });
      }
    }
  }
});

export const getCombinedFeed = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Get user's activities
    const activities = await ctx.db.query("activities").collect();

    // Get user's movies
    const userMovies = await ctx.db
      .query("userMovies")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    // Get user's series
    const userSeries = await ctx.db
      .query("userSeries")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    // Get all movies and series details
    const movieIds = userMovies.map((um) => um.movieId).filter((id): id is Id<"movies"> => id !== null);
    const seriesIds = userSeries.map((us) => us.seriesId).filter((id): id is Id<"series"> => id !== null);

    const movies = await Promise.all(movieIds.map((id) => ctx.db.get(id)));
    const seriesDetails = await Promise.all(seriesIds.map((id) => ctx.db.get(id)));

    // Combine all items into a single array with type information
    const combinedItems = [
      ...activities.map((activity) => ({
        type: "activity" as const,
        id: activity._id,
        name: activity.name,
        iconName: activity.iconName,
        createdAt: activity._creationTime
      })),
      ...userMovies.map((userMovie) => {
        const movie = movies.find((m) => m?._id === userMovie.movieId);
        return {
          type: "movie" as const,
          id: userMovie._id,
          name: movie?.title || "Unknown Movie",
          iconName: "Film",
          createdAt: userMovie._creationTime,
          movie,
          userMovie
        };
      }),
      ...userSeries.map((userSeriesItem) => {
        const seriesDetail = seriesDetails.find((s) => s?._id === userSeriesItem.seriesId);
        return {
          type: "series" as const,
          id: userSeriesItem._id,
          name: seriesDetail?.name || "Unknown Series",
          iconName: "Tv",
          createdAt: userSeriesItem._creationTime,
          series: seriesDetail,
          userSeries: userSeriesItem
        };
      })
    ];

    // Sort by creation time, newest first
    return combinedItems.sort((a, b) => b.createdAt - a.createdAt);
  }
});

export const getRandomItems = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    // Get random activities
    const activities = await ctx.db.query("activities").collect();
    const randomActivities = activities.sort(() => Math.random() - 0.5).slice(0, Math.ceil(args.limit / 3));

    // Get random movies
    const movies = await ctx.db.query("movies").collect();
    const randomMovies = movies.sort(() => Math.random() - 0.5).slice(0, Math.ceil(args.limit / 3));

    // Get random series
    const series = await ctx.db.query("series").collect();
    const randomSeries = series.sort(() => Math.random() - 0.5).slice(0, Math.ceil(args.limit / 3));

    // Combine and format all items
    const combinedItems = [
      ...randomActivities.map((activity) => ({
        type: "activity" as const,
        name: activity.name,
        iconName: activity.iconName,
        contentType: activity.contentType
      })),
      ...randomMovies.map((movie) => ({
        type: "movie" as const,
        name: movie.title,
        iconName: "Film",
        contentType: "movie",
        posterUrl: movie.imageUrl
      })),
      ...randomSeries.map((series) => ({
        type: "series" as const,
        name: series.name,
        iconName: "Tv",
        contentType: "series",
        posterUrl: series.posterUrl
      }))
    ];

    // Shuffle the combined array and limit to requested size
    return combinedItems.sort(() => Math.random() - 0.5).slice(0, args.limit);
  }
});

// Add a search function for activities
export const searchActivities = query({
  args: {
    query: v.string()
  },
  handler: async (ctx, args) => {
    const { query } = args;
    const lowerQuery = query.toLowerCase();

    const activities = await ctx.db.query("activities").collect();

    // Filter activities where name or description contains the query
    return activities
      .filter((activity) => activity.name.toLowerCase().includes(lowerQuery) || (activity.description?.toLowerCase().includes(lowerQuery) ?? false))
      .slice(0, 10);
  }
});

// Update an activity
export const update = mutation({
  args: {
    id: v.id("activities"),
    name: v.string(),
    category: v.string(),
    iconName: v.string(),
    contentType: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    return await ctx.db.patch(id, data);
  }
});

// Delete an activity
export const deleteActivity = mutation({
  args: {
    id: v.id("activities")
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  }
});

export const updateCategories = mutation({
  handler: async (ctx) => {
    const activities = await ctx.db.query("activities").collect();

    const categoryMapping = {
      "Yeni Bir Şey Denemek": "Yeni Bir Şey Deneyimlemek",
      "Bir Şeyler İzlemek": "Bir Şey İzlemek",
      "Bir Şeyler Oynamak": "Bir Şey Oynamak",
      "Bir Yere Gitmek": "Bir Yere Gitmek", // stays the same
      "Bir Etkinliğe Gitmek": "Bir Etkinliğe Gitmek", // stays the same
      "Bir Aktivite Yapmak": "Bir Aktivite Yapmak" // stays the same
    };

    for (const activity of activities) {
      const newCategory = categoryMapping[activity.category as keyof typeof categoryMapping];
      if (newCategory) {
        await ctx.db.patch(activity._id, { category: newCategory });
      }
    }
  }
});
