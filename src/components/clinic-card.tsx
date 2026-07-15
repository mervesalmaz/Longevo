import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { type Clinic } from "@/lib/types";

interface ClinicCardProps {
  clinic: Clinic & { avg_rating?: number; review_count?: number };
  treatments?: string[];
}

export function ClinicCard({ clinic, treatments = [] }: ClinicCardProps) {
  const avgRating = clinic.avg_rating ?? 0;
  const reviewCount = clinic.review_count ?? 0;

  return (
    <div className="rounded-lg border overflow-hidden hover:shadow-lg transition-shadow group bg-white">
      <Link href={`/clinics/${clinic.slug}`}>
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={clinic.cover_image_url}
            alt={clinic.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            fallbackText={clinic.name[0]}
          />
          <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </Link>

      <Link href={`/clinics/${clinic.slug}`}>
        <div className="p-4">
          {/* Rating dots */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: i < Math.floor(avgRating) ? 'hsl(var(--longevo-green))' : '#E0E0E0'
                }}
              />
            ))}
            <span className="ml-2 font-semibold text-sm">
              {reviewCount > 0 ? reviewCount.toLocaleString() : "New"}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-semibold text-lg group-hover:underline mb-1 line-clamp-1">
            {clinic.name}
          </h3>

          {/* Description */}
          {clinic.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {clinic.description}
            </p>
          )}

          {/* Location & treatments */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {clinic.city}, {clinic.country}
            </span>
            {treatments.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {treatments[0]}
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
