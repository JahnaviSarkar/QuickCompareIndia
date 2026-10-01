import { searchParamsCache } from "@/lib/search-params-server";
import { FilterBar } from "@/components/filters/filter-bar";
import { getCompanyMetrics } from "@/lib/data";
import { KPICard } from "@/components/kpi-card";
import { AppInsightCard } from "@/components/app-insight-card";

export default async function OverviewPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const searchParams = await props.searchParams;
  const { apps, period, metric } = searchParamsCache.parse(searchParams);
  
  const data = getCompanyMetrics();
  
  const filteredApps = data.apps.filter(app => apps.includes(app.id));

  return (
    <div className="flex flex-col min-h-screen  ">
      <FilterBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-10 max-w-2xl">
          <div className="text-primary font-bold uppercase tracking-widest text-xs mb-3">
            Overview
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            India&apos;s Quick Commerce Landscape
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Compare scale and profitability metrics across the four leading quick commerce apps shaping the market today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredApps.map(app => {
            const quarterData = data.quarterly.find(q => q.appId === app.id && q.quarter === period);
            const annualData = data.annual.find(a => a.appId === app.id); // For apps like zepto missing quarterly

            let valueToShow = "Not disclosed";
            let sources: any[] = [];
            let note = "";
            let confidence: "high" | "medium" | undefined = undefined;

            if (quarterData) {
              if (metric === "nov" && quarterData.nov) {
                valueToShow = `₹${quarterData.nov} Cr`;
              } else if (metric === "gov" && quarterData.gov) {
                valueToShow = `₹${quarterData.gov} Cr`;
              } else if (metric === "orders" && quarterData.ordersM) {
                valueToShow = `${quarterData.ordersM}M`;
              }
              
              if (valueToShow !== "Not disclosed") {
                const sourceObjects = quarterData.sources.map(s => data.sources.find(src => src.id === s)).filter(Boolean);
                sources = sourceObjects;
                note = quarterData.note || "";
                confidence = quarterData.confidence;
              }
            } else if (annualData && period === "Q1 FY27") {
               // Fallback for Zepto which only has annual data
               if (metric === "orders" && annualData.ordersM_approx) {
                 valueToShow = `~${annualData.ordersM_approx}M (FY26)`;
                 sources = annualData.sources.map(s => data.sources.find(src => src.id === s)).filter(Boolean);
                 note = annualData.note || "";
                 confidence = annualData.confidence;
               }
            }

            return (
              <KPICard
                key={app.id}
                title={`${app.name} ${metric.toUpperCase()}`}
                value={valueToShow}
                badgeType={confidence ? (confidence === "high" ? "Reported" : "Secondary source") : undefined}
                badgeConfidence={confidence}
                sources={sources}
                note={note}
                appColor={app.color}
              />
            );
          })}
        </div>

        <div className="mb-12">
          <div className="text-primary font-bold uppercase tracking-widest text-xs mb-3">
            Key Insights
          </div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-8">What stands out</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AppInsightCard 
              index={1}
              appName="Blinkit"
              color="#F8CB46"
              insight="First profitable quarter streak"
              detail="Blinkit turned Adjusted EBITDA positive in Q3 FY26 and has maintained profitability while scaling NOV by 86% YoY."
            />
            <AppInsightCard 
              index={2}
              appName="Zepto"
              color="#7B2FBE"
              insight="Fastest order growth, widening loss"
              detail="Zepto shows aggressive scaling with 2.33M orders/day in Q4 FY26, but net loss widened to ₹5,905 Cr in FY26."
            />
            <AppInsightCard 
              index={3}
              appName="Swiggy Instamart"
              color="#FC8019"
              insight="Contribution margin breakeven"
              detail="Hit contribution breakeven in May 2026 by rationalizing unprofitable users, but still operates at an adjusted EBITDA loss of ₹778 Cr."
            />
            <AppInsightCard 
              index={4}
              appName="Flipkart Minutes"
              color="#2874F0"
              insight="Rapid store expansion"
              detail="Despite being a late entrant, it has rapidly scaled to over 1,000 dark stores across 130 cities by September 2026."
            />
          </div>
        </div>

        <div className="bg-muted/30 text-muted-foreground p-4 rounded-lg text-sm mb-12 border border-border">
          <p className="font-semibold text-foreground mb-1">Disclaimer:</p>
          <p>{data.meta.notes[0]}</p>
        </div>

        <div className="flex flex-wrap gap-4 pt-8 border-t border-border">
          <a href="/scale" className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-muted font-medium transition-colors">
            Scale tab &rarr;
          </a>
          <a href="/fees" className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-muted font-medium transition-colors">
            Fee calculator &rarr;
          </a>
          <a href="/verdict" className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-muted font-medium transition-colors">
            Build your verdict &rarr;
          </a>
        </div>
      </main>
    </div>
  );
}
