/**
 * (main) route group layout. The i18n LocaleProvider now lives in the root
 * layout (so it also covers the cookie banner and admin), making this layout
 * a pass-through. Chrome (Header/Footer) is rendered by each page — either
 * directly (home page per its spec) or via <PageShell> (all others).
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
