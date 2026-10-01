"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QualityBadge } from "../quality-badge";
import { QuarterlyMetric, App } from "@/lib/types";

type ScaleLineChartProps = {
  data: QuarterlyMetric[];
  apps: App[];
  metric: string;
};

export function ScaleLineChart({ data, apps, metric }: ScaleLineChartProps) {
  // Get all unique quarters
  const quarters = Array.from(new Set(data.map(d => d.quarter))).sort();
  
  // Format data for Recharts
  const chartData = quarters.map(q => {
    const dataPoint: any = { quarter: q };
    apps.forEach(app => {
      const appData = data.find(d => d.appId === app.id && d.quarter === q);
      if (appData) {
        if (metric === "nov") dataPoint[app.id] = appData.nov;
        if (metric === "gov") dataPoint[app.id] = appData.gov;
        if (metric === "orders") dataPoint[app.id] = appData.ordersM;
      }
    });
    return dataPoint;
  });

  const activeApps = apps.filter(app => ["blinkit", "instamart"].includes(app.id));

  return (
    <Card className="col-span-full     shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-bold">Growth over available quarters</CardTitle>
            <CardDescription>Blinkit and Instamart comparison</CardDescription>
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
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) => metric === 'orders' ? `${value}M` : `₹${value}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any, name: any) => [
                  metric === 'orders' ? `${value}M` : `₹${value} Cr`,
                  activeApps.find(a => a.id === name)?.name || name
                ]}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {activeApps.map(app => (
                <Line 
                  key={app.id} 
                  type="monotone" 
                  dataKey={app.id} 
                  name={app.name} 
                  stroke={app.color} 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  connectNulls
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
