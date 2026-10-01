import { searchParamsCache } from "@/lib/search-params-server";
import { FilterBar } from "@/components/filters/filter-bar";
import { getCompanyMetrics } from "@/lib/data";
import { ScaleLineChart } from "@/components/charts/scale-line-chart";
import { ScaleBarChart } from "@/components/charts/scale-bar-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QualityBadge } from "@/components/quality-badge";
import { SourcePopover } from "@/components/source-popover";

export default async function ScalePage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const searchParams = await props.searchParams;
  const { apps, period, metric } = searchParamsCache.parse(searchParams);
  
  const data = getCompanyMetrics();
  const filteredApps = data.apps.filter(app => apps.includes(app.id));

  // Zepto FY26 data
  const zeptoData = data.annual.find(a => a.appId === "zepto");
  const zeptoSources = zeptoData ? zeptoData.sources.map(s => data.sources.find(src => src.id === s)).filter(Boolean) as any[] : [];

  return (
    <div className="flex flex-col min-h-screen  ">
      <FilterBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-10 max-w-2xl">
          <div className="text-primary font-bold uppercase tracking-widest text-xs mb-3">
            Scale
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Growth & Order Volumes
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Compare growth trajectories, order volumes, and gross order values.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1 lg:col-span-2">
            <ScaleLineChart data={data.quarterly} apps={filteredApps} metric={metric} />
          </div>
          <div className="col-span-1">
            <ScaleBarChart data={data.quarterly} apps={filteredApps} period={period} />
          </div>
        </div>

        {apps.includes("zepto") && zeptoData && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground dark:text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#7B2FBE" }}></div>
              Zepto Scale Profile (FY26)
            </h2>
            <Card className="    shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#7B2FBE]" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Annual Snapshot</CardTitle>
                    <CardDescription>Metrics from the June 2026 DRHP</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <QualityBadge type="Secondary source" confidence={zeptoData.confidence} />
                    <SourcePopover sources={zeptoSources} note={zeptoData.note} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Revenue (FY26)</div>
                    <div className="text-2xl font-bold">₹{zeptoData.revenueFromOperations} Cr</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Orders (FY26)</div>
                    <div className="text-2xl font-bold">~{zeptoData.ordersM_approx}M</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Avg Daily Orders</div>
                    <div className="text-2xl font-bold">{zeptoData.avgDailyOrdersLakh} Lakh</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Annual Users</div>
                    <div className="text-2xl font-bold">{zeptoData.annualTransactingUsersM}M</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </main>
    </div>
  );
}
