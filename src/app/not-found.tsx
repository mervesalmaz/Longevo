import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <Leaf className="h-12 w-12 text-primary mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground mb-6">
          Aradığın sayfa bulunamadı.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Ana sayfa</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/search">Klinikleri keşfet</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
