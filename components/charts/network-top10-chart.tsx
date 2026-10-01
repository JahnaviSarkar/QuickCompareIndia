"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QualityBadge } from "../quality-badge";
import { NetworkTop10Cities, App } from "@/lib/types";

type NetworkTop10ChartProps = {
  data: NetworkTop10Cities;
  apps: App[];
};

export function NetworkTop10Chart({ data, apps }: NetworkTop10ChartProps) {
  // Merge app colors and filter based on selected apps, but keep bigbasket as reference if available
  const chartData = data.rows.map(row => {
    const appDef = apps.find(a => a.id === row.appId);
    return {
      name: appDef?.name || row.name || row.appId,
      stores: row.darkStoresTop10,
      color: appDef?.color || row.color || "#cbd5e1",
      appId: row.appId
    };
  }).filter(row => row.appId === "bigbasket" || apps.some(a => a.id === row.appId))
    .sort((a, b) => b.stores - a.stores); // Sort descending

  return (
    <Card className="    shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-bold">Top 10 Cities Dark Stores</CardTitle>
            <CardDescription>{data.meta.asOf} snapshot by {data.meta.note?.split(' ')[0] || 'CLSA'}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
             <QualityBadge type="Secondary source" confidence={data.meta.confidence} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [`${value} Stores`, 'Top 10 Cities']}
              />
              <Bar dataKey="stores" radius={[4, 4, 0, 0]} maxBarSize={60}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} opacity={entry.appId === 'bigbasket' ? 0.6 : 1} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
