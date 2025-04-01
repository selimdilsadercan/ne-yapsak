import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ExperienceCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
}

export function ExperienceCard({ id, name, description, imageUrl, location, price, rating, reviewCount }: ExperienceCardProps) {
  return (
    <Link href={`/experience/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 w-full">
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({reviewCount})</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{location}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="font-semibold">{price} TL</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
