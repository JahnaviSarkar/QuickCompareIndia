import { searchParamsCache } from "@/lib/search-params-server";
import { FilterBar } from "@/components/filters/filter-bar";
import { getCompanyMetrics, getFeesSnapshot } from "@/lib/data";
import { FeeBreakdownChart } from "@/components/charts/fee-breakdown-chart";
import { FeeCalculator } from "@/components/fee-calculator";
import { AlertTriangle } from "lucide-react";

export default async function FeesPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const searchParams = await props.searchParams;
  const { apps } = searchParamsCache.parse(searchParams);
  
  const companyData = getCompanyMetrics();
  const feesData = getFeesSnapshot();
  
  const filteredApps = companyData.apps.filter(app => apps.includes(app.id));

  return (
    <div className="flex flex-col min-h-screen  ">
      <FilterBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground dark:text-white mb-2">Fees</h1>
          <p className="text-muted-foreground ">
            Compare delivery, handling, and small cart fees across platforms.
          </p>
        </div>

        <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg p-4 mb-8 flex items-start gap-3">
          <AlertTriangle className="text-amber-600 dark:text-amber-500 w-6 h-6 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-bold text-amber-900 dark:text-amber-400">November 2025 Snapshot</h3>
            <p className="text-amber-800 dark:text-amber-200/80 text-sm mt-1">
              Fees change often depending on weather, time of day, and location. This data is a point-in-time snapshot. Verify in the app.
              Flipkart Minutes has no public fee data available.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FeeBreakdownChart data={feesData} apps={filteredApps} />
          <FeeCalculator data={feesData} apps={filteredApps} />
        </div>
      </main>
    </div>
  );
}
