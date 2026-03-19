import { Suspense } from "react";
import ReviewForm from "./review-form";

export default function NewReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>}>
      <ReviewForm />
    </Suspense>
  );
}
