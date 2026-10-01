import { searchParamsCache } from "@/lib/search-params-server";
import { FilterBar } from "@/components/filters/filter-bar";
import { getCompanyMetrics } from "@/lib/data";
import { EbitdaChart } from "@/components/charts/ebitda-chart";
import { EbitdaMarginChart } from "@/components/charts/ebitda-margin-chart";
import { InstamartMarginChart } from "@/components/charts/instamart-margin-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QualityBadge } from "@/components/quality-badge";
import { SourcePopover } from "@/components/source-popover";

export default async function ProfitabilityPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const searchParams = await props.searchParams;
  const { apps } = searchParamsCache.parse(searchParams);
  
  const data = getCompanyMetrics();
  const filteredApps = data.apps.filter(app => apps.includes(app.id));

  const zeptoData = data.annual.find(a => a.appId === "zepto");
  const zeptoSources = zeptoData ? zeptoData.sources.map(s => data.sources.find(src => src.id === s)).filter(Boolean) as any[] : [];

  return (
    <div className="flex flex-col min-h-screen  ">
      <FilterBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-10 max-w-2xl">
          <div className="text-primary font-bold uppercase tracking-widest text-xs mb-3">
            Profitability
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Margins & Bottom Line
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Analyze EBITDA margins and paths to profitability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EbitdaChart data={data.quarterly} apps={filteredApps} />
          <EbitdaMarginChart data={data.quarterly} apps={filteredApps} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {apps.includes("instamart") && (
            <InstamartMarginChart data={data.quarterly} apps={filteredApps} />
          )}
          
          {apps.includes("zepto") && zeptoData && (
            <Card className="    shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#7B2FBE]" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Zepto Net Loss (FY26)</CardTitle>
                    <CardDescription>Annual profitability snapshot</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <QualityBadge type="Secondary source" confidence={zeptoData.confidence} />
                    <SourcePopover sources={zeptoSources} note={zeptoData.note} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-4 p-6   rounded-lg border  ">
                  <div className="text-sm text-muted-foreground mb-1">FY26 Net Loss</div>
                  <div className="text-4xl font-bold text-foreground dark:text-white mb-2">
                    ₹{zeptoData.netLoss} Cr
                  </div>
                  <div className="text-sm text-muted-foreground mt-4">
                    Zepto&apos;s net loss widened in FY26 compared to FY25 (₹4,700 Cr) due to aggressive scaling and expansion.
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
