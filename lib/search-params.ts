import { parseAsArrayOf, parseAsString } from 'nuqs';

export const appParser = parseAsArrayOf(parseAsString).withDefault(["blinkit", "zepto", "instamart", "flipkart_minutes"]);
export const periodParser = parseAsString.withDefault("Q1 FY27");
export const metricParser = parseAsString.withDefault("nov");
