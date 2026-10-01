import { getCompanyMetrics, getFeesSnapshot } from "./data";

export type Scores = {
  appId: string;
  network: number | null;
  growth: number | null;
  profitability: number | null;
  fees: number | null;
};

export function getAppScores(): Scores[] {
  const metrics = getCompanyMetrics();
  const feesData = getFeesSnapshot();

  const raw = metrics.apps.map(app => {
    // 1. Network (Latest Dark Stores)
    let networkVal: number | null = null;
    const latestQ = metrics.quarterly.find(q => q.appId === app.id && q.quarter === "Q1 FY27");
    const snapshot = metrics.quarterly.find(q => q.appId === app.id && q.quarter.includes("snapshot"));
    const annual = metrics.annual.find(a => a.appId === app.id);
    
    if (snapshot && snapshot.darkStores) networkVal = snapshot.darkStores;
    else if (latestQ && latestQ.darkStores) networkVal = latestQ.darkStores;
    else if (annual && annual.darkStoresAtYearEnd) networkVal = annual.darkStoresAtYearEnd;

    // 2. Growth (YoY % from latest quarter)
    let growthVal: number | null = null;
    if (latestQ) {
      if (latestQ.novGrowthYoYPct != null) growthVal = latestQ.novGrowthYoYPct;
      else if (latestQ.govGrowthYoYPct != null) growthVal = latestQ.govGrowthYoYPct;
    }

    // 3. Profitability (Margin %)
    let profVal: number | null = null;
    if (latestQ) {
      if (latestQ.adjEbitdaPctNov != null) profVal = latestQ.adjEbitdaPctNov;
      else if (latestQ.adjEbitdaPctGov != null) profVal = latestQ.adjEbitdaPctGov;
    } else if (annual && annual.netLoss != null && annual.revenueFromOperations != null) {
      // Proxy margin for Zepto using net loss / revenue
      profVal = ( -annual.netLoss / annual.revenueFromOperations ) * 100;
    }

    // 4. Fees (Lower is better) - Small cart total extra charges
    let feesVal: number | null = null;
    const feeRow = feesData.small_order_under_99.find(f => f.appId === app.id);
    if (feeRow) {
      feesVal = feeRow.extraCharges;
    }

    return { appId: app.id, networkVal, growthVal, profVal, feesVal };
  });

  // Helper to normalize
  const normalize = (val: number | null, allVals: (number | null)[], invert = false) => {
    if (val === null) return null;
    const valid = allVals.filter(v => v !== null) as number[];
    if (valid.length < 2) return 10; // default to 10 if not enough data to compare
    const min = Math.min(...valid);
    const max = Math.max(...valid);
    if (min === max) return 10;
    
    let score = 10 * (val - min) / (max - min);
    if (invert) score = 10 - score;
    return Number(score.toFixed(1));
  };

  const allNetwork = raw.map(r => r.networkVal);
  const allGrowth = raw.map(r => r.growthVal);
  const allProf = raw.map(r => r.profVal);
  const allFees = raw.map(r => r.feesVal);

  return raw.map(r => ({
    appId: r.appId,
    network: normalize(r.networkVal, allNetwork),
    growth: normalize(r.growthVal, allGrowth),
    profitability: normalize(r.profVal, allProf),
    fees: normalize(r.feesVal, allFees, true), // invert because lower fee is better
  }));
}
