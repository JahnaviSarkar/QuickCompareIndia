"use client";

import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Scores } from "@/lib/scoring";
import { App } from "@/lib/types";

type VerdictScorecardProps = {
  scores: Scores[];
  apps: App[];
};

export function VerdictScorecard({ scores, apps }: VerdictScorecardProps) {
  const [weights, setWeights] = useState({
    network: 5,
    growth: 5,
    profitability: 5,
    fees: 5,
  });

  const activeApps = apps.filter(app => scores.find(s => s.appId === app.id));

  const setPreset = (preset: "cheap_fees" | "big_network" | "balanced") => {
    if (preset === "cheap_fees") setWeights({ network: 2, growth: 2, profitability: 2, fees: 10 });
    if (preset === "big_network") setWeights({ network: 10, growth: 5, profitability: 2, fees: 2 });
    if (preset === "balanced") setWeights({ network: 5, growth: 5, profitability: 5, fees: 5 });
  };

  const finalScores = activeApps.map(app => {
    const s = scores.find(x => x.appId === app.id)!;
    
    // Calculate total score based on weights, ignoring nulls
    let totalScore = 0;
    let maxPossible = 0;
    let validCriteriaCount = 0;

    if (s.network !== null) { totalScore += s.network * weights.network; maxPossible += 10 * weights.network; validCriteriaCount++; }
    if (s.growth !== null) { totalScore += s.growth * weights.growth; maxPossible += 10 * weights.growth; validCriteriaCount++; }
    if (s.profitability !== null) { totalScore += s.profitability * weights.profitability; maxPossible += 10 * weights.profitability; validCriteriaCount++; }
    if (s.fees !== null) { totalScore += s.fees * weights.fees; maxPossible += 10 * weights.fees; validCriteriaCount++; }

    const finalScore = maxPossible > 0 ? (totalScore / maxPossible) * 10 : -1;
    const displayScore = maxPossible > 0 ? Number(finalScore.toFixed(1)) : "n/a";

    return {
      appId: app.id,
      name: app.name,
      color: app.color,
      finalScore,
      displayScore,
      validCriteriaCount,
      network: s.network !== null ? Number(s.network.toFixed(1)) : 0,
      growth: s.growth !== null ? Number(s.growth.toFixed(1)) : 0,
      profitability: s.profitability !== null ? Number(s.profitability.toFixed(1)) : 0,
      fees: s.fees !== null ? Number(s.fees.toFixed(1)) : 0,
    };
  }).sort((a, b) => b.finalScore - a.finalScore);

  const radarData = [
    { subject: 'Network', ...Object.fromEntries(finalScores.map(a => [a.name, a.network])) },
    { subject: 'Growth', ...Object.fromEntries(finalScores.map(a => [a.name, a.growth])) },
    { subject: 'Profitability', ...Object.fromEntries(finalScores.map(a => [a.name, a.profitability])) },
    { subject: 'Fees', ...Object.fromEntries(finalScores.map(a => [a.name, a.fees])) },
  ];

  return (
    <Card className="    shadow-sm col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Interactive Verdict</CardTitle>
        <CardDescription>Adjust priorities to see who leads based on your preferences</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row gap-8">
        {/* Controls & Leaderboard */}
        <div className="flex-1">
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setPreset("balanced")}>Balanced</Button>
            <Button variant="outline" size="sm" onClick={() => setPreset("cheap_fees")}>Cheap Fees</Button>
            <Button variant="outline" size="sm" onClick={() => setPreset("big_network")}>Big Network</Button>
          </div>

          <div className="space-y-6 mb-8">
            {Object.entries(weights).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium capitalize">{key}</span>
                  <span className="text-sm text-muted-foreground">{val}/10</span>
                </div>
                <Slider
                  value={[val]}
                  max={10}
                  step={1}
                  onValueChange={(v: any) => {
                    const num = Array.isArray(v) ? v[0] : v;
                    if (typeof num === 'number' && !isNaN(num)) {
                      setWeights(prev => ({ ...prev, [key]: num }));
                    }
                  }}
                />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="font-bold mb-2">Leaderboard</h3>
            {finalScores.map((score, idx) => (
              <div key={score.appId} className="flex items-center justify-between p-3 rounded-md   border  ">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-muted-foreground w-4">{idx + 1}.</span>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: score.color }} />
                  <div>
                    <span className="font-medium block">{score.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Based on {score.validCriteriaCount} of 4 criteria
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold">{score.displayScore}</span>
                  {score.displayScore !== "n/a" && <span className="text-xs text-muted-foreground block">/10</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="flex-1 h-[400px] lg:h-auto min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#334155" opacity={0.2} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {finalScores.map(app => (
                <Radar
                  key={app.name}
                  name={app.name}
                  dataKey={app.name}
                  stroke={app.color}
                  fill={app.color}
                  fillOpacity={0.1}
                  isAnimationActive={false}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
          <div className="text-xs text-muted-foreground text-center mt-4">
            Note: Apps without data for a criterion are scored 0 on the radar and excluded from that criterion's weighting in the total score.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
