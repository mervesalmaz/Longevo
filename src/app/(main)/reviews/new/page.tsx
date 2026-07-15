import { Suspense } from "react";
import { PageShell } from "@/components/home/PageShell";
import ReviewForm from "./review-form";

export default function NewReviewPage() {
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              Yükleniyor...
            </div>
          </div>
        }
      >
        <ReviewForm />
      </Suspense>
    </PageShell>
  );
}
