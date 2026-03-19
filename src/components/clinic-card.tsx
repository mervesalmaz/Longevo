import Link from "next/link";
import { MapPin, Star, BadgeCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { type Clinic } from "@/lib/types";

interface ClinicCardProps {
  clinic: Clinic & { avg_rating?: number; review_count?: number };
  treatments?: string[];
}

export function ClinicCard({ clinic, treatments = [] }: ClinicCardProps) {
  const avgRating = clinic.avg_rating ?? 0;
  const reviewCount = clinic.review_count ?? 0;

  return (
    <Link href={`/clinics/${clinic.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 h-full">
        <div className="relative h-48 bg-muted">
          {clinic.cover_image_url ? (
            <img
              src={clinic.cover_image_url}
              alt={clinic.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary/30">
                {clinic.name[0]}
              </span>
            </div>
          )}
          {clinic.verified && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-primary text-white gap-1">
                <BadgeCheck size={14} />
                Verified
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight">
              {clinic.name}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
              <MapPin size={14} />
              <span>
                {clinic.city}, {clinic.country}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="font-semibold text-sm">
                {avgRating > 0 ? avgRating.toFixed(1) : "New"}
              </span>
            </div>
            {reviewCount > 0 && (
              <span className="text-muted-foreground text-sm">
                ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </span>
            )}
          </div>

          {clinic.doctors && clinic.doctors.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users size={14} />
              <span>
                {clinic.doctors[0].name}
                {clinic.doctors.length > 1 &&
                  ` +${clinic.doctors.length - 1} more`}
              </span>
            </div>
          )}

          {treatments.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {treatments.slice(0, 3).map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">
                  {t}
                </Badge>
              ))}
              {treatments.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{treatments.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
