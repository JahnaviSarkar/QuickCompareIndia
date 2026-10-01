import { z } from "zod";
import * as schemas from "./schemas";

export type Source = z.infer<typeof schemas.SourceSchema>;
export type App = z.infer<typeof schemas.AppSchema>;
export type QuarterlyMetric = z.infer<typeof schemas.QuarterlyMetricSchema>;
export type AnnualMetric = z.infer<typeof schemas.AnnualMetricSchema>;
export type CompanyMetrics = z.infer<typeof schemas.CompanyMetricsSchema>;
export type NetworkTop10Cities = z.infer<typeof schemas.NetworkTop10CitiesSchema>;
export type FeesSnapshot = z.infer<typeof schemas.FeesSnapshotSchema>;
