"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QualityBadge } from "../quality-badge";
import { QuarterlyMetric, App } from "@/lib/types";

type ScaleBarChartProps = {
  data: QuarterlyMetric[];
  apps: App[];
  period: string;
};

export function ScaleBarChart({ data, apps, period }: ScaleBarChartProps) {
  // Only Blinkit and Instamart report NOV properly for quarterly
  const activeApps = apps.filter(app => ["blinkit", "instamart"].includes(app.id));
  
  const chartData = activeApps.map(app => {
    const appData = data.find(d => d.appId === app.id && d.quarter === period);
    return {
      name: app.name,
      nov: appData?.nov || 0,
      color: app.color,
    };
  }).filter(d => d.nov > 0);

  return (
    <Card className="    shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-bold">Latest NOV ({period})</CardTitle>
            <CardDescription>Like-for-like comparison</CardDescription>
          </div>
          <div className="flex items-center gap-2">
             <QualityBadge type="Reported" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} margin={{ top: 5, right: 0, bottom: 5, left: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={(val) => `₹${val}`} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: "bold", fill: "#334155" }} width={120} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`₹${value} Cr`, 'NOV']}
                />
                <Bar dataKey="nov" radius={[0, 4, 4, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[250px] w-full mt-4 flex items-center justify-center text-muted-foreground italic">
            Data not available for {period}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
