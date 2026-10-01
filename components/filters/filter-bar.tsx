"use client";

import { useQueryState } from "nuqs";
import { appParser, periodParser, metricParser } from "@/lib/search-params";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ALL_APPS = [
  { id: "blinkit", name: "Blinkit", color: "#F8CB46" },
  { id: "zepto", name: "Zepto", color: "#7B2FBE" },
  { id: "instamart", name: "Instamart", color: "#FC8019" },
  { id: "flipkart_minutes", name: "Flipkart Minutes", color: "#2874F0" }
];

const PERIODS = ["Q1 FY26", "Q2 FY26", "Q3 FY26", "Q4 FY26", "Q1 FY27"];
const METRICS = [
  { id: "nov", name: "NOV (Net Order Value)" },
  { id: "gov", name: "GOV (Gross Order Value)" },
  { id: "orders", name: "Orders" },
];

export function FilterBar() {
  const [apps, setApps] = useQueryState("apps", appParser);
  const [period, setPeriod] = useQueryState("period", periodParser);
  const [metric, setMetric] = useQueryState("metric", metricParser);

  const toggleApp = (id: string) => {
    const currentApps = apps || [];
    if (currentApps.includes(id)) {
      if (currentApps.length > 1) { // prevent deselecting all
        setApps(currentApps.filter(a => a !== id));
      }
    } else {
      setApps([...currentApps, id]);
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border py-3">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground mr-2">Compare:</span>
          {ALL_APPS.map(app => {
            const isActive = apps?.includes(app.id);
            return (
              <Button
                key={app.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => toggleApp(app.id)}
                className={cn(
                  "rounded-full transition-colors text-xs font-semibold h-7",
                  isActive 
                    ? "" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div 
                  className="w-2 h-2 rounded-full mr-1.5" 
                  style={{ backgroundColor: app.color }} 
                />
                {app.name}
              </Button>
            );
          })}
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(v) => { setPeriod(v); }}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              {PERIODS.map(p => (
                <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={metric} onValueChange={(v) => { setMetric(v); }}>
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              {METRICS.map(m => (
                <SelectItem key={m.id} value={m.id} className="text-xs">{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
