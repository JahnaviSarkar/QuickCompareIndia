import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type QualityBadgeProps = {
  confidence?: "high" | "medium";
  type: "Reported" | "Derived" | "Approx" | "Company claim" | "Secondary source" | "Snapshot" | "Snapshot (dated)";
  className?: string;
};

export function QualityBadge({ confidence, type, className }: QualityBadgeProps) {
  const colorClass = "bg-muted/50 text-muted-foreground border-border";

  return (
    <Badge variant="outline" className={cn("text-[10px] uppercase font-semibold tracking-wider", colorClass, className)}>
      {type}
    </Badge>
  );
}
