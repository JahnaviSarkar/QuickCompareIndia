"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { CopyLinkButton } from "./copy-link-button";

const TABS = [
  { name: "Overview", href: "/" },
  { name: "Scale", href: "/scale" },
  { name: "Network", href: "/network" },
  { name: "Profitability", href: "/profitability" },
  { name: "Fees", href: "/fees" },
  { name: "Verdict", href: "/verdict" },
  { name: "Data & Sources", href: "/sources" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <div className="w-full flex flex-col">
      {/* Top Meta Bar */}
      <div className="w-full bg-[#091C1B] text-[#C2F2E4] py-1.5 px-4 text-xs">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center opacity-80 gap-2 text-center sm:text-left">
          <span>Zero fabrication &mdash; every figure is cited and dated; gaps render as &apos;Not disclosed&apos;, never estimated.</span>
          <span>Compiled Oct 2026 &middot; <Link href="/sources" className="hover:text-primary transition-colors underline underline-offset-2">Methodology & sources</Link></span>
        </div>
      </div>

      <header className="w-full border-b border-border bg-background">
        <div className="container mx-auto px-4 pt-6 pb-0">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <Link href="/" className="font-serif text-4xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
                  QuickCompare
                </Link>
                <span className="text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/30 px-1.5 py-0.5 rounded-sm bg-primary/5">
                  INDIA
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                An interactive dashboard comparing India&apos;s four quick-commerce apps
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-3">
              <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hidden sm:flex items-center gap-2">
                <span>Blinkit</span> &middot; <span>Zepto</span> &middot; <span>Swiggy Instamart</span> &middot; <span>Flipkart Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CopyLinkButton />
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center gap-6 overflow-x-auto hide-scrollbar pt-2">
            {TABS.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "pb-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-[1px]",
                    isActive
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </div>
  );
}
