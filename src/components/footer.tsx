import { Leaf } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Leaf className="h-5 w-5 text-primary" />
              Longevo
            </div>
            <p className="text-sm text-muted-foreground">
              Discover and review the world&apos;s best longevity clinics.
              Your journey to optimal health starts here.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Discover</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  All Clinics
                </Link>
              </li>
              <li>
                <Link href="/search?city=Istanbul" className="hover:text-primary transition-colors">
                  Istanbul
                </Link>
              </li>
              <li>
                <Link href="/search?city=Berlin" className="hover:text-primary transition-colors">
                  Berlin
                </Link>
              </li>
              <li>
                <Link href="/search?city=London" className="hover:text-primary transition-colors">
                  London
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Treatments</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/search?treatment=iv-therapy" className="hover:text-primary transition-colors">
                  IV Therapy
                </Link>
              </li>
              <li>
                <Link href="/search?treatment=nad-therapy" className="hover:text-primary transition-colors">
                  NAD+ Therapy
                </Link>
              </li>
              <li>
                <Link href="/search?treatment=biomarker-testing" className="hover:text-primary transition-colors">
                  Biomarker Testing
                </Link>
              </li>
              <li>
                <Link href="/search?treatment=stem-cell-therapy" className="hover:text-primary transition-colors">
                  Stem Cell Therapy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/auth/login" className="hover:text-primary transition-colors">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-primary transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Longevo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
