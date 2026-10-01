import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QualityBadge } from "./quality-badge";
import { SourcePopover } from "./source-popover";
import { Source } from "@/lib/types";

type KPICardProps = {
  title: string;
  value: React.ReactNode;
  badgeType?: "Reported" | "Derived" | "Approx" | "Company claim" | "Secondary source" | "Snapshot";
  badgeConfidence?: "high" | "medium";
  sources: Source[];
  note?: string;
  appColor?: string;
};

export function KPICard({
  title,
  value,
  badgeType,
  badgeConfidence,
  sources,
  note,
  appColor,
}: KPICardProps) {
  return (
    <Card className="flex flex-col h-full border border-border shadow-none rounded-[10px]">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5 pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        {appColor && (
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: appColor }} />
        )}
      </CardHeader>
      <CardContent className="flex flex-col flex-1 px-5 pb-5">
        <div className="text-4xl font-bold tracking-tight text-foreground tabular-nums mb-4">
          {value || <span className="text-muted-foreground italic text-xl tracking-normal font-normal">Not disclosed</span>}
        </div>
        
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {badgeType && (
              <QualityBadge type={badgeType} confidence={badgeConfidence} />
            )}
            {sources && sources.length > 0 && (
              <SourcePopover sources={sources} note={note} />
            )}
          </div>
          {note && <div className="text-xs text-muted-foreground italic leading-tight">{note}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
