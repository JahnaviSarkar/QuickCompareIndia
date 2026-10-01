import { searchParamsCache } from "@/lib/search-params-server";
import { FilterBar } from "@/components/filters/filter-bar";
import { getCompanyMetrics, getNetworkTop10Cities } from "@/lib/data";
import { NetworkTop10Chart } from "@/components/charts/network-top10-chart";
import { StoreGrowthChart } from "@/components/charts/store-growth-chart";
import { KPICard } from "@/components/kpi-card";

export default async function NetworkPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const searchParams = await props.searchParams;
  const { apps } = searchParamsCache.parse(searchParams);
  
  const data = getCompanyMetrics();
  const networkData = getNetworkTop10Cities();
  
  const filteredApps = data.apps.filter(app => apps.includes(app.id));

  // Determine latest store counts and cities for KPI cards
  const kpiData = filteredApps.map(app => {
    // Look at Q1 FY27 first, then fall back to annual or latest available
    let stores = "Not disclosed";
    let cities = "Not disclosed";
    let sources: any[] = [];
    let note = "";
    let confidence: "high" | "medium" | undefined = undefined;

    const latestQ = data.quarterly.find(q => q.appId === app.id && q.quarter === "Q1 FY27");
    const snapshot = data.quarterly.find(q => q.appId === app.id && q.quarter.includes("snapshot"));
    const annual = data.annual.find(a => a.appId === app.id);
    
    // Check snapshot (Flipkart Minutes)
    if (snapshot) {
      if (snapshot.darkStores) stores = `${snapshot.darkStores}`;
      if (snapshot.cities) cities = `${snapshot.cities}`;
      sources = snapshot.sources.map(s => data.sources.find(src => src.id === s)).filter(Boolean);
      note = snapshot.note || "";
      confidence = snapshot.confidence;
    } 
    // Check latest quarter
    else if (latestQ) {
      if (latestQ.darkStores) stores = `${latestQ.darkStores}`;
      if (latestQ.cities) cities = `${latestQ.cities}`;
      sources = latestQ.sources.map(s => data.sources.find(src => src.id === s)).filter(Boolean);
      note = latestQ.note || "";
      confidence = latestQ.confidence;
    }
    // Check annual (Zepto)
    else if (annual) {
      if (annual.darkStoresAtYearEnd) stores = `${annual.darkStoresAtYearEnd}`;
      sources = annual.sources.map(s => data.sources.find(src => src.id === s)).filter(Boolean);
      note = annual.note || "";
      confidence = annual.confidence;
    }

    return {
      app,
      stores,
      cities,
      sources,
      note,
      confidence
    };
  });

  return (
    <div className="flex flex-col min-h-screen  ">
      <FilterBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-10 max-w-2xl">
          <div className="text-primary font-bold uppercase tracking-widest text-xs mb-3">
            Network
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Store Coverage & Density
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Compare dark store counts and city presence.
          </p>
        </div>

        <h2 className="text-xl font-bold text-foreground dark:text-white mb-4">National Footprint</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {kpiData.map(kpi => (
            <KPICard
              key={kpi.app.id}
              title={`${kpi.app.name} Stores`}
              value={kpi.stores}
              badgeType={kpi.confidence ? (kpi.confidence === "high" ? "Reported" : "Company claim") : undefined}
              badgeConfidence={kpi.confidence}
              sources={kpi.sources}
              note={kpi.note}
              appColor={kpi.app.color}
            />
          ))}
        </div>

        <h2 className="text-xl font-bold text-foreground dark:text-white mb-4">Cities Covered</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {kpiData.map(kpi => (
            <KPICard
              key={kpi.app.id + "_cities"}
              title={`${kpi.app.name} Cities`}
              value={kpi.cities}
              badgeType={kpi.confidence ? (kpi.confidence === "high" ? "Reported" : "Secondary source") : undefined}
              badgeConfidence={kpi.confidence}
              sources={kpi.sources}
              note={kpi.note}
              appColor={kpi.app.color}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <NetworkTop10Chart data={networkData} apps={filteredApps} />
          <StoreGrowthChart data={data.quarterly} apps={filteredApps} />
        </div>
      </main>
    </div>
  );
}
