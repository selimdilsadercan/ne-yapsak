import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ExperienceCard } from "@/components/ExperienceCard";
import { EmptyState } from "@/components/EmptyState";

interface ExperienceListProps {
  userId: string;
}

export function ExperienceList({ userId }: ExperienceListProps) {
  const experiences = useQuery(api.experiences.getAll);

  if (!experiences || experiences.length === 0) {
    return <EmptyState message="Henüz deneyim eklenmemiş" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {experiences.map((experience) => (
        <ExperienceCard
          key={experience._id}
          id={experience._id}
          name={experience.name}
          description={experience.description}
          imageUrl={experience.imageUrl}
          location={experience.location}
          price={experience.price}
          rating={experience.rating}
          reviewCount={experience.reviewCount}
        />
      ))}
    </div>
  );
}
