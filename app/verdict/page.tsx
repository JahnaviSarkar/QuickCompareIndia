import { searchParamsCache } from "@/lib/search-params-server";
import { FilterBar } from "@/components/filters/filter-bar";
import { getCompanyMetrics, getFeesSnapshot } from "@/lib/data";
import { getAppScores } from "@/lib/scoring";
import { VerdictScorecard } from "@/components/verdict-scorecard";
import { QualityBadge } from "@/components/quality-badge";
import { SourcePopover } from "@/components/source-popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function VerdictPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const searchParams = await props.searchParams;
  const { apps } = searchParamsCache.parse(searchParams);
  
  const companyData = getCompanyMetrics();
  const filteredApps = companyData.apps.filter(app => apps.includes(app.id));
  
  const scores = getAppScores();

  // Create summary data for "Who leads at what" table
  const leaders = [
    { 
      criterion: "Network Size", 
      leader: "Blinkit", 
      metric: "2,443 dark stores", 
      badge: "Reported",
      sources: companyData.sources.filter(s => s.id === "s3" || s.id === "s1"),
      note: "As of Q1 FY27"
    },
    { 
      criterion: "Growth", 
      leader: "Blinkit", 
      metric: "86% YoY NOV Growth", 
      badge: "Reported",
      sources: companyData.sources.filter(s => s.id === "s2"),
      note: "As of Q1 FY27"
    },
    { 
      criterion: "Profitability", 
      leader: "Blinkit", 
      metric: "0.6% Adj EBITDA Margin", 
      badge: "Reported",
      sources: companyData.sources.filter(s => s.id === "s1" || s.id === "s4"),
      note: "As of Q1 FY27. Zepto and Instamart are loss-making."
    },
    { 
      criterion: "Fee Friendliness", 
      leader: "Zepto", 
      metric: "₹30 extra charges", 
      badge: "Snapshot (dated)",
      sources: getFeesSnapshot().sources.filter(s => s.id === "f1" || s.id === "f2"),
      note: "Nov 2025. Dropped handling/small-cart fees."
    },
    { 
      criterion: "Coverage", 
      leader: "Swiggy Instamart", 
      metric: "131 cities", 
      badge: "Reported",
      sources: companyData.sources.filter(s => s.id === "s11"),
      note: "Flipkart claims 130 cities. Blinkit has fewer but higher density."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen  ">
      <FilterBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-10 max-w-2xl">
          <div className="text-primary font-bold uppercase tracking-widest text-xs mb-3">
            Verdict
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Build Your Verdict
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A head-to-head comparison based solely on public data. Rank apps according to your priorities.
          </p>
        </div>

        <div className="  rounded-xl border   shadow-sm overflow-hidden mb-10">
          <div className="p-6 border-b  ">
            <h2 className="text-2xl font-serif font-bold">Who leads at what</h2>
            <p className="text-sm text-muted-foreground">Based on absolute figures across all available data.</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className=" ">
                <TableRow>
                  <TableHead className="w-[180px]">Criterion</TableHead>
                  <TableHead>Leader</TableHead>
                  <TableHead>Metric</TableHead>
                  <TableHead>Reliability</TableHead>
                  <TableHead className="text-right">Sources</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaders.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{row.criterion}</TableCell>
                    <TableCell className="font-bold">{row.leader}</TableCell>
                    <TableCell>{row.metric}</TableCell>
                    <TableCell>
                      <QualityBadge type={row.badge as any} />
                    </TableCell>
                    <TableCell className="text-right">
                      <SourcePopover sources={row.sources} note={row.note} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="grid grid-cols-1">
          <VerdictScorecard scores={scores} apps={filteredApps} />
        </div>
      </main>
    </div>
  );
}
