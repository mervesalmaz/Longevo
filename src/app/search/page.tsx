import { Suspense } from "react";
import SearchContent from "./search-content";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><div className="h-96 bg-muted animate-pulse rounded-lg" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
