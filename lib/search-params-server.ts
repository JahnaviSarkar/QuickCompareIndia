import { createSearchParamsCache, parseAsArrayOf, parseAsString } from 'nuqs/server';

export const searchParamsCache = createSearchParamsCache({
  apps: parseAsArrayOf(parseAsString).withDefault(["blinkit", "zepto", "instamart", "flipkart_minutes"]),
  period: parseAsString.withDefault("Q1 FY27"),
  metric: parseAsString.withDefault("nov"),
});
