"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QualityBadge } from "../quality-badge";
import { QuarterlyMetric, App } from "@/lib/types";

type EbitdaChartProps = {
  data: QuarterlyMetric[];
  apps: App[];
};

export function EbitdaChart({ data, apps }: EbitdaChartProps) {
  const activeApps = apps.filter(app => ["blinkit", "instamart"].includes(app.id));
  const parseQuarter = (q: string) => {
    if (q.includes('Sep 2026')) return 'FY27 Q1.5';
    const parts = q.split(' ');
    return parts.length === 2 ? `${parts[1]} ${parts[0]}` : q;
  };
  const quarters = Array.from(new Set(data.filter(d => d.adjEbitda != null).map(d => d.quarter))).sort((a, b) => parseQuarter(a).localeCompare(parseQuarter(b)));
  
  const chartData = quarters.map(q => {
    const dataPoint: any = { quarter: q };
    activeApps.forEach(app => {
      const appData = data.find(d => d.appId === app.id && d.quarter === q);
      if (appData && appData.adjEbitda != null) {
        dataPoint[app.id] = appData.adjEbitda;
      }
    });
    return dataPoint;
  });

  return (
    <Card className="    shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-bold">Adjusted EBITDA (₹ Cr)</CardTitle>
            <CardDescription>Quarterly profitability trend</CardDescription>
          </div>
          <div className="flex items-center gap-2">
             <QualityBadge type="Reported" />
             <div className="text-xs text-muted-foreground   px-2 py-1 rounded">Quarterly reporting</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any, name: any) => [
                  `₹${value} Cr`,
                  activeApps.find(a => a.id === name)?.name || name
                ]}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
              {activeApps.map(app => (
                <Bar 
                  key={app.id} 
                  dataKey={app.id} 
                  name={app.name} 
                  fill={app.color} 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
