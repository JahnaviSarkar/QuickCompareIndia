import { QuarterlyMetric, AnnualMetric } from "./types";

export function deriveNovPerStorePerDay(nov: number, darkStores: number): number {
  return (nov * 10000000) / darkStores / 91;
}

export function deriveAdjEbitdaPctNov(adjEbitda: number, nov: number): number {
  return (adjEbitda / nov) * 100;
}

export function deriveNetLossChangeYoY(netLossFY25: number, netLossFY26: number): number {
  return ((netLossFY26 - netLossFY25) / netLossFY25) * 100;
}

export function deriveStoreShareTop10(darkStoresTop10: number, totalTop10: number): number {
  return (darkStoresTop10 / totalTop10) * 100;
}
