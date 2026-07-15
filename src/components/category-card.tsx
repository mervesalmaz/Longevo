import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: LucideIcon;
  description: string;
}

export function CategoryCard({ name, slug, icon: Icon, description }: CategoryCardProps) {
  return (
    <Link href={`/search?treatment=${slug}`}>
      <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="font-semibold mb-1">{name}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
