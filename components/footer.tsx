export function Footer() {
  return (
    <footer className="w-full border-t border-border mt-12 py-6 bg-background">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <div>
          QuickCompare India &mdash; public, cited data only. Zero fabrication policy.
        </div>
        <div>
          <a href="/sources" className="hover:text-primary transition-colors underline underline-offset-2">
            View all sources and methodology
          </a>
        </div>
      </div>
    </footer>
  );
}
