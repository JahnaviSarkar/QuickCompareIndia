"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QualityBadge } from "../quality-badge";
import { FeesSnapshot, App } from "@/lib/types";

type FeeBreakdownChartProps = {
  data: FeesSnapshot;
  apps: App[];
};

export function FeeBreakdownChart({ data, apps }: FeeBreakdownChartProps) {
  // Only include apps that have fee data
  const chartData = apps.map(app => {
    const appData = data.small_order_under_99.find(d => d.appId === app.id);
    if (!appData) return null;
    return {
      name: app.name,
      deliveryFee: appData.deliveryFee,
      smallCartFee: appData.smallCartFee,
      handlingFee: appData.handlingFee,
      total: appData.extraCharges,
      color: app.color,
    };
  }).filter(Boolean);

  return (
    <Card className="    shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-bold">Small Order Extra Charges (Under ₹99)</CardTitle>
            <CardDescription>Breakdown of fees applied to a small cart</CardDescription>
          </div>
          <div className="flex items-center gap-2">
             <QualityBadge type="Snapshot (dated)" confidence={data.meta.confidence} />
             <div className="text-xs text-muted-foreground   px-2 py-1 rounded">Nov 2025</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 30, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any, name: any) => [`₹${value}`, name]}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="deliveryFee" name="Delivery Fee" stackId="a" fill="#3b82f6" isAnimationActive={false} />
                <Bar dataKey="smallCartFee" name="Small Cart Fee" stackId="a" fill="#f59e0b" isAnimationActive={false} />
                <Bar dataKey="handlingFee" name="Handling Fee" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] w-full mt-4 flex items-center justify-center text-muted-foreground italic">
            No fee data available for selected apps.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
