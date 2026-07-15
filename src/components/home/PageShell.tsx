import Header from "./Header";
import Footer from "./Footer";

/**
 * Shared chrome wrapper used by non-home pages within the (main) route
 * group. The home page renders Header/Footer explicitly per its spec;
 * every other page uses this helper to stay DRY.
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
