"use client";

import { ThumbsUp, Circle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/locale-provider";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    title: string;
    body: string;
    treatment_received?: string;
    verified_visit?: boolean;
    created_at: string;
  };
  userName?: string;
  avatarUrl?: string;
}

export function ReviewCard({ review, userName, avatarUrl }: ReviewCardProps) {
  const { t, locale } = useTranslation();
  const displayName = userName || t("review_card_anonymous");
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="border-b pb-6 mb-6 last:border-b-0">
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-gray-200 text-gray-600">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold">{displayName}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Circle
                    key={i}
                    className="w-2.5 h-2.5"
                    fill={i < review.rating ? "hsl(var(--longevo-green))" : "#E0E0E0"}
                    stroke="none"
                  />
                ))}
              </div>
              <span>·</span>
              <span>{formatDate(review.created_at)}</span>
            </div>
          </div>

          {review.title && (
            <h4 className="font-semibold mb-2">{review.title}</h4>
          )}
          <p className="text-gray-700 mb-4 leading-relaxed">{review.body}</p>

          {review.treatment_received && (
            <span className="inline-block text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1 mb-3">
              {review.treatment_received}
            </span>
          )}

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-gray-600">
              <ThumbsUp className="w-4 h-4" />
              {t("review_card_helpful")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
