"use client";

import { useState, useMemo } from "react";
import { SwipeableCard } from "@/components/SwipeableCard";
import { toast } from "react-hot-toast";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Generate random angle between -8 and 8 degrees
const getRandomAngle = () => Math.random() * 16 - 8;

// Mock data for movies with additional details
const mockMovies = [
  {
    _id: "movie9",
    title: "Interstellar",
    imageUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    rating: 8.6,
    year: 2014,
    duration: 169, // 2h 49m
    genres: ["Adventure", "Drama", "Sci-Fi"],
    imdbRank: 21,
    awards: ["2015 Oscar Winner - Best Visual Effects"],
    actors: [
      {
        name: "Matthew McConaughey",
        imageUrl: "https://image.tmdb.org/t/p/w500/wJiGedOCZhwMx9DezY8uwbNxmAY.jpg",
        isLiked: true
      },
      {
        name: "Anne Hathaway",
        imageUrl: "https://image.tmdb.org/t/p/w500/tLelKoPNiyJCSEtQTj1uGK59GM1.jpg"
      }
    ]
  },
  {
    _id: "movie10",
    title: "The Lord of the Rings: The Fellowship of the Ring",
    imageUrl: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    rating: 8.8,
    year: 2001,
    duration: 178, // 2h 58m
    genres: ["Action", "Adventure", "Drama", "Fantasy"],
    imdbRank: 9,
    awards: ["2002 Oscar Winner - Best Cinematography"],
    actors: [
      {
        name: "Elijah Wood",
        imageUrl: "https://image.tmdb.org/t/p/w500/7UKRbJBNG7mxBl2QQc5XsAh6F8B.jpg"
      },
      {
        name: "Viggo Mortensen",
        imageUrl: "https://image.tmdb.org/t/p/w500/vH5gVSpHAMhDaFWfh0Q7BG61O1y.jpg",
        isLiked: true
      }
    ]
  },
  {
    _id: "movie1",
    title: "Inception",
    imageUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    rating: 8.8,
    year: 2010,
    duration: 148, // 2h 28m
    genres: ["Action", "Sci-Fi", "Thriller"],
    imdbRank: 13,
    awards: ["2011 Oscar Winner - Best Visual Effects", "2011 Oscar Winner - Best Cinematography"],
    actors: [
      {
        name: "Leonardo DiCaprio",
        imageUrl: "https://image.tmdb.org/t/p/w500/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
        isLiked: true
      },
      {
        name: "Joseph Gordon-Levitt",
        imageUrl: "https://image.tmdb.org/t/p/w500/4U9G4YwTlIEbAymBaseltS8uqOZ.jpg"
      }
    ]
  },
  {
    _id: "movie2",
    title: "The Shawshank Redemption",
    imageUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    rating: 9.3,
    year: 1994,
    duration: 142, // 2h 22m
    genres: ["Drama"],
    imdbRank: 1,
    awards: ["7 Oscar Nominations"],
    actors: [
      {
        name: "Morgan Freeman",
        imageUrl: "https://image.tmdb.org/t/p/w500/oIciQWr8VwKoR8TmAw1owaiZFyb.jpg",
        isLiked: true
      },
      {
        name: "Tim Robbins",
        imageUrl: "https://image.tmdb.org/t/p/w500/hsCu1JUzQQ4pl7uFxAVFLOs9yHh.jpg"
      }
    ]
  },
  {
    _id: "movie3",
    title: "The Dark Knight",
    imageUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    rating: 9.0,
    year: 2008,
    duration: 152, // 2h 32m
    genres: ["Action", "Crime", "Drama", "Thriller"],
    imdbRank: 3,
    awards: ["2009 Oscar Winner - Best Supporting Actor"],
    actors: [
      {
        name: "Christian Bale",
        imageUrl: "https://image.tmdb.org/t/p/w500/qCpZn2e3dimwbryLnqxZuI88PTi.jpg"
      },
      {
        name: "Heath Ledger",
        imageUrl: "https://image.tmdb.org/t/p/w500/5Y9HnYYa9jF4NunY9lSgJGjVxPY.jpg",
        isLiked: true
      }
    ]
  },
  {
    _id: "movie4",
    title: "Pulp Fiction",
    imageUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    rating: 8.9,
    year: 1994,
    duration: 154, // 2h 34m
    genres: ["Crime", "Drama"],
    imdbRank: 8,
    awards: ["1995 Oscar Winner - Best Original Screenplay"],
    actors: [
      {
        name: "John Travolta",
        imageUrl: "https://image.tmdb.org/t/p/w500/ns8uZHmWgrW2LmWmB9TeHTtQsR1.jpg"
      },
      {
        name: "Samuel L. Jackson",
        imageUrl: "https://image.tmdb.org/t/p/w500/nCJJ3NVksYNxIzEHcyC1XziwPVj.jpg",
        isLiked: true
      }
    ]
  },
  {
    _id: "movie5",
    title: "Forrest Gump",
    imageUrl: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    rating: 8.8,
    year: 1994,
    duration: 142, // 2h 22m
    genres: ["Drama", "Romance"],
    imdbRank: 12,
    awards: ["1995 Oscar Winner - Best Picture", "1995 Oscar Winner - Best Actor"],
    actors: [
      {
        name: "Tom Hanks",
        imageUrl: "https://image.tmdb.org/t/p/w500/xndWFsBlClOJFRdhSt4NBwiPq2o.jpg",
        isLiked: true
      },
      {
        name: "Robin Wright",
        imageUrl: "https://image.tmdb.org/t/p/w500/8QVb4Ht1l8m8WKZkkgPB2HYQ0kv.jpg"
      }
    ]
  },
  {
    _id: "movie6",
    title: "The Matrix",
    imageUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    rating: 8.7,
    year: 1999,
    duration: 136, // 2h 16m
    genres: ["Action", "Sci-Fi"],
    imdbRank: 16,
    awards: ["2000 Oscar Winner - Best Visual Effects"],
    actors: [
      {
        name: "Keanu Reeves",
        imageUrl: "https://image.tmdb.org/t/p/w500/4D0PpNI0kmP58hgrwGC3wCjxhnm.jpg",
        isLiked: true
      },
      {
        name: "Laurence Fishburne",
        imageUrl: "https://image.tmdb.org/t/p/w500/8suOhUmPbfKqDQ17jQ1Gy0nKLM2.jpg"
      }
    ]
  },
  {
    _id: "movie7",
    title: "Goodfellas",
    imageUrl: "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
    rating: 8.7,
    year: 1990,
    duration: 146, // 2h 26m
    genres: ["Biography", "Crime", "Drama"],
    imdbRank: 17,
    awards: ["1991 Oscar Winner - Best Supporting Actor"],
    actors: [
      {
        name: "Robert De Niro",
        imageUrl: "https://image.tmdb.org/t/p/w500/cT8htcckIuyI1Lqwt1CvD02ynTh.jpg",
        isLiked: true
      },
      {
        name: "Ray Liotta",
        imageUrl: "https://image.tmdb.org/t/p/w500/4tLQU8AhxL57OqKZkqMmcGHGHiI.jpg"
      }
    ]
  },
  {
    _id: "movie8",
    title: "The Silence of the Lambs",
    imageUrl: "https://image.tmdb.org/t/p/w500/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg",
    rating: 8.6,
    year: 1991,
    duration: 118, // 1h 58m
    genres: ["Crime", "Drama", "Thriller"],
    imdbRank: 22,
    awards: ["1992 Oscar Winner - Best Picture", "1992 Oscar Winner - Best Actor & Actress"],
    actors: [
      {
        name: "Anthony Hopkins",
        imageUrl: "https://image.tmdb.org/t/p/w500/9ukJS2QWTJ22HcwR1ktMmoJ6RSL.jpg",
        isLiked: true
      },
      {
        name: "Jodie Foster",
        imageUrl: "https://image.tmdb.org/t/p/w500/qYRRpFwsqHUUk4F6GXPqmVEfRqE.jpg"
      }
    ]
  }
];

function MoviesExplorePage() {
  // Use mock data instead of fetching from Convex for now
  const movies = mockMovies;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Generate random angles for each card and memoize them
  const cardAngles = useMemo(() => movies?.map(() => getRandomAngle()) ?? [], [movies]);

  const handleSwipe = (direction: "left" | "right" | "up") => {
    if (direction === "up") {
      toast.success("Listenize eklendi!");
    } else if (direction === "right") {
      toast.success("İyi eğlenceler!");
    }

    // Move to next card
    setCurrentIndex((prev) => prev + 1);
  };

  if (currentIndex >= movies.length) {
    return (
      <div className="container flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Tüm filmleri gördünüz!</h1>
        <p className="text-muted-foreground">Daha fazla film için keşfet sayfasını ziyaret edin.</p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mx-auto max-w-[320px]">
        <div className="relative h-[500px]">
          {movies.slice(currentIndex, currentIndex + 3).map((movie, index) => {
            const angle = cardAngles[currentIndex + index];
            const xOffset = Math.sin(angle * (Math.PI / 180)) * 5;

            return (
              <div
                key={movie._id}
                className="absolute inset-x-0"
                style={{
                  zIndex: movies.length - index,
                  transform: `
                    scale(${1 - index * 0.03}) 
                    translateY(${index * 4}px)
                    translateX(${xOffset}px)
                    rotate(${angle}deg)
                  `,
                  opacity: 1 - index * 0.15,
                  transition: "transform 0.3s ease-out"
                }}
              >
                <SwipeableCard
                  title={movie.title}
                  iconName="Film"
                  imageUrl={movie.imageUrl}
                  onSwipe={handleSwipe}
                  rating={movie.rating}
                  year={movie.year}
                  duration={movie.duration}
                  genres={movie.genres}
                  imdbRank={movie.imdbRank}
                  awards={movie.awards}
                  actors={movie.actors}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MoviesExplorePage;
