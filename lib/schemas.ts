import { z } from "zod";

export const SourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  publisher: z.string(),
  date: z.string(),
  url: z.string(),
});

export const AppSchema = z.object({
  id: z.string(),
  name: z.string(),
  parent: z.string(),
  color: z.string(),
  disclosure: z.string(),
});

export const QuarterlyMetricSchema = z.object({
  appId: z.string(),
  quarter: z.string(),
  period: z.string(),
  confidence: z.enum(["high", "medium"]),
  note: z.string().optional(),
  sources: z.array(z.string()).min(1),
  
  // metrics
  gov: z.number().optional(),
  nov: z.number().optional(),
  darkStores: z.number().optional(),
  monthlyTransactingCustomersM: z.number().optional(),
  adjEbitda: z.number().optional(),
  novGrowthYoYPct: z.number().optional(),
  novGrowthQoQPct: z.number().optional(),
  netStoreAdditions: z.number().optional(),
  adjEbitdaPctNov: z.number().optional(),
  netAov: z.number().optional(),
  ordersM: z.number().optional(),
  novPerStorePerDayLakh: z.number().optional(),
  ordersPerDayM_derived: z.number().optional(),
  ordersPerDayMethod: z.string().optional(),
  contributionMarginPctNov: z.number().optional(),
  grossMarginPctNov: z.number().optional(),
  inventoryLossPctNov: z.number().optional(),
  contributionMarginPctGov: z.number().optional(),
  ordersPerStorePerDay: z.union([z.number(), z.string()]).optional(),
  adjRevenuePerOrder: z.number().optional(),
  govGrowthYoYPct: z.number().optional(),
  cities: z.number().optional(),
  monthlyTransactingUsersM: z.number().optional(),
  monthlyTransactingUsersNote: z.string().optional(),
  adjEbitdaPctGov: z.number().optional(),
  normalisedAov: z.number().optional(),
  storeUtilisationPct: z.number().optional(),
  ordersPerDayM: z.number().optional(),
  totalCostPerOrder: z.number().optional(),
  activeDeliveryPartners: z.number().optional(),
  darkStoresNote: z.string().optional(),
  citiesNote: z.string().optional(),
  ordersPerDayNote: z.string().optional(),
  ordersPerStorePerDayNote: z.string().optional(),
  targetDarkStoresEnd2026: z.number().optional(),
  orderGrowthYoYx: z.number().optional(),
  tier2And3OrderGrowthYoYx: z.number().optional(),
});

export const AnnualMetricSchema = z.object({
  appId: z.string(),
  fiscalYear: z.string(),
  confidence: z.enum(["high", "medium"]),
  note: z.string().optional(),
  sources: z.array(z.string()).min(1),
  
  revenueFromOperations: z.number().optional(),
  netLoss: z.number().optional(),
  avgDailyOrdersLakh: z.number().optional(),
  ordersM_approx: z.number().optional(),
  annualTransactingUsersM: z.number().optional(),
  darkStoresAtYearEnd: z.number().optional(),
});

export const CompanyMetricsSchema = z.object({
  meta: z.object({
    title: z.string(),
    compiledOn: z.string(),
    latestQuarter: z.string(),
    currency: z.string(),
    units: z.string(),
    notes: z.array(z.string()),
  }),
  apps: z.array(AppSchema),
  quarterly: z.array(QuarterlyMetricSchema),
  annual: z.array(AnnualMetricSchema),
  sources: z.array(SourceSchema),
});

export const NetworkTop10CitiesSchema = z.object({
  meta: z.object({
    title: z.string(),
    asOf: z.string(),
    unit: z.string(),
    note: z.string(),
    confidence: z.enum(["high", "medium"]),
  }),
  rows: z.array(z.object({
    appId: z.string(),
    darkStoresTop10: z.number(),
    name: z.string().optional(),
    color: z.string().optional(),
    note: z.string().optional(),
  })),
  totalTop10: z.number(),
  sources: z.array(SourceSchema),
});

export const FeesSnapshotSchema = z.object({
  meta: z.object({
    title: z.string(),
    asOf: z.string(),
    staleWarning: z.string(),
    flipkartMinutes: z.string(),
    confidence: z.enum(["high", "medium"]),
  }),
  small_order_under_99: z.array(z.object({
    appId: z.string(),
    deliveryFee: z.number(),
    smallCartFee: z.number(),
    handlingFee: z.number(),
    extraCharges: z.number(),
    note: z.string().optional(),
  })),
  example_basket_84_rupees_total_paid: z.array(z.object({
    appId: z.string(),
    totalPaid: z.number(),
    note: z.string().optional(),
  })),
  free_delivery_threshold: z.array(z.object({
    appId: z.string(),
    thresholdRupees: z.number(),
    note: z.string().optional(),
  })),
  sources: z.array(SourceSchema),
});
