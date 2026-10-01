import fs from "fs";
import path from "path";
import { CompanyMetricsSchema, NetworkTop10CitiesSchema, FeesSnapshotSchema } from "./schemas";
import type { CompanyMetrics, NetworkTop10Cities, FeesSnapshot } from "./types";

export function getCompanyMetrics(): CompanyMetrics {
  const filePath = path.join(process.cwd(), "data", "company-metrics.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return CompanyMetricsSchema.parse(data);
}

export function getNetworkTop10Cities(): NetworkTop10Cities {
  const filePath = path.join(process.cwd(), "data", "network-top10-cities.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return NetworkTop10CitiesSchema.parse(data);
}

export function getFeesSnapshot(): FeesSnapshot {
  const filePath = path.join(process.cwd(), "data", "fees-snapshot.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return FeesSnapshotSchema.parse(data);
}
