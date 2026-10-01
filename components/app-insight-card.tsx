import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AppInsightCardProps = {
  index: number;
  appName: string;
  color: string;
  insight: string;
  detail: string;
};

export function AppInsightCard({ index, appName, color, insight, detail }: AppInsightCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-sm relative overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-1 h-full" 
        style={{ backgroundColor: color }} 
      />
      <CardHeader className="pb-2 flex flex-row items-baseline gap-2 space-y-0">
        <span className="text-3xl font-serif font-bold text-muted-foreground/30">{index}</span>
        <CardTitle className="text-sm font-bold uppercase tracking-wider" style={{ color }}>{appName}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <h4 className="font-serif text-lg font-bold text-foreground mb-2 leading-tight">
          {insight}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {detail}
        </p>
      </CardContent>
    </Card>
  );
}
