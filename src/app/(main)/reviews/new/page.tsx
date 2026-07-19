import { Suspense } from "react";
import { PageShell } from "@/components/home/PageShell";
import { getT } from "@/lib/i18n/server";
import ReviewForm from "./review-form";

export default function NewReviewPage() {
  const t = getT();
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              {t("common_loading")}
            </div>
          </div>
        }
      >
        <ReviewForm />
      </Suspense>
    </PageShell>
  );
}
