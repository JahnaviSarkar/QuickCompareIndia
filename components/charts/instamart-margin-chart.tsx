"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QualityBadge } from "../quality-badge";
import { QuarterlyMetric, App } from "@/lib/types";

type InstamartMarginChartProps = {
  data: QuarterlyMetric[];
  apps: App[];
};

export function InstamartMarginChart({ data, apps }: InstamartMarginChartProps) {
  const instamart = apps.find(a => a.id === "instamart");
  
  if (!instamart) return null;

  const chartData = data
    .filter(d => d.appId === "instamart" && d.contributionMarginPctGov != null)
    .map(d => ({
      quarter: d.quarter,
      margin: d.contributionMarginPctGov,
      note: d.note
    }))
    .sort((a, b) => a.quarter.localeCompare(b.quarter));

  return (
    <Card className="    shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: instamart.color }} />
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-bold">Instamart Contribution Margin</CardTitle>
            <CardDescription>Path to breakeven (% of GOV)</CardDescription>
          </div>
          <div className="flex items-center gap-2">
             <QualityBadge type="Reported" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full mt-4">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [`${value}%`, 'Contribution Margin']}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
              />
              <ReferenceLine y={0} stroke="#22c55e" strokeDasharray="3 3" label={{ position: 'top', value: 'Breakeven', fill: '#22c55e', fontSize: 12 }} />
              <Line 
                type="monotone" 
                dataKey="margin" 
                name="Margin" 
                stroke={instamart.color} 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Note: Swiggy Instamart hit contribution breakeven in May 2026. The Q1 FY27 full-quarter margin was -0.2%.
        </div>
      </CardContent>
    </Card>
  );
}
