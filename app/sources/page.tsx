import React from "react";
import { FilterBar } from "@/components/filters/filter-bar";
import { getCompanyMetrics, getFeesSnapshot, getNetworkTop10Cities } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Source } from "@/lib/types";

export default async function SourcesPage() {
  const companyData = getCompanyMetrics();
  const feesData = getFeesSnapshot();
  const networkData = getNetworkTop10Cities();

  // Combine and deduplicate sources
  const allSourcesMap = new Map<string, Source>();
  [...companyData.sources, ...feesData.sources, ...networkData.sources].forEach(s => {
    if (!allSourcesMap.has(s.id)) {
      allSourcesMap.set(s.id, s);
    }
  });
  
  const sources = Array.from(allSourcesMap.values()).sort((a, b) => {
    // Sort by date descending
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="flex flex-col min-h-screen  ">
      <React.Suspense fallback={<div className="h-14 border-b   /50 " />}>
        <FilterBar />
      </React.Suspense>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground dark:text-white mb-2">Data & Sources</h1>
          <p className="text-muted-foreground ">
            Every figure in this dashboard is sourced from public filings, shareholder letters, or reputable press reports. 
            We do not fabricate, estimate, or impute missing data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card className="    shadow-sm">
            <CardHeader>
              <CardTitle>Reliability Tiers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground ">
              <div>
                <strong className="text-foreground ">High:</strong> Direct from company shareholder letters, earnings calls, or official DRHPs. Values are taken verbatim.
              </div>
              <div>
                <strong className="text-foreground ">Medium:</strong> Figures reported in reputable media summarising results, analyst reports (like UBS or CLSA), or secondary data points. Prone to minor inaccuracies.
              </div>
              <div>
                <strong className="text-foreground ">Snapshot (dated):</strong> Data valid only for a specific point in time (e.g., Nov 2025 fee structures). Subject to frequent undocumented changes.
              </div>
            </CardContent>
          </Card>

          <Card className="    shadow-sm">
            <CardHeader>
              <CardTitle>Known Conflicts & Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground ">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Blinkit NOV typo:</strong> Business Standard incorrectly printed Blinkit's Q1 FY27 NOV as ₹7,130 crore instead of ₹17,132 crore. We used the correct figure verified by BW Disrupt and YoY growth rates.</li>
                <li><strong>Zepto Revenue:</strong> General press reports Zepto's FY26 revenue as ~₹22,624 Cr. TechCrunch cited "operating revenue" at ₹11,550 Cr. We display the most commonly cited figure from IPO DRHP analysis.</li>
                <li><strong>Flipkart Minutes:</strong> Flipkart does not break out standalone financials for Minutes. All data is based on company claims (e.g. store counts) or analyst estimates.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="  rounded-xl border   shadow-sm overflow-hidden mb-10">
          <div className="p-6 border-b  ">
            <h2 className="text-xl font-bold">Source Directory</h2>
            <p className="text-sm text-muted-foreground">Chronological list of all references used across the app.</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className=" ">
                <TableRow>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="w-[150px]">Publisher</TableHead>
                  <TableHead>Title & Link</TableHead>
                  <TableHead className="w-[80px]">ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.map(source => (
                  <TableRow key={source.id}>
                    <TableCell className="text-muted-foreground whitespace-nowrap">{source.date}</TableCell>
                    <TableCell className="font-medium">{source.publisher}</TableCell>
                    <TableCell>
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {source.title}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs font-mono">{source.id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>


      </main>
    </div>
  );
}
