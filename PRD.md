# PRD: QuickCompare India (real-data edition)

Compares **Blinkit, Zepto, Swiggy Instamart and Flipkart Minutes** using publicly reported numbers only.
**Type:** interactive static web dashboard · **Deploy:** Vercel · **Data snapshot:** compiled 23–24 Sep 2026, latest quarter Q1 FY27 (Apr–Jun 2026)

---

## 0. Master Prompt (paste into Antigravity first)

> Build an interactive dashboard web app called **QuickCompare India** following the attached PRD.md exactly.
>
> **Stack:** Next.js (App Router) + TypeScript, Tailwind CSS, shadcn/ui, Recharts, Framer Motion, `nuqs` for URL-synced filters, Zod for data validation. No backend, no database, no env vars. Must deploy on Vercel with zero config.
>
> **The data is already provided in the `/data` folder** (`company-metrics.json`, `network-top10-cities.json`, `fees-snapshot.json`). It is real, sourced data. **Use it exactly. Never invent, estimate, round up or fill in any number.** If a value is `null` or missing, show "Not disclosed" in the UI. Never fabricate placeholder data.
>
> **Every number shown must carry a visible data-quality badge and a source link**, and every chart must show its reporting period. Blinkit and Instamart are quarterly, Zepto is annual (FY26) plus one quarter, Flipkart Minutes has no financials. Do not present these as like-for-like unless the field and period match.
>
> **Design:** clean editorial-analytics look, light and dark mode, mobile-first, fixed brand-inspired colour per app (from the data file), smooth transitions, skeleton loaders, accessible.
>
> **Pages:** Overview, Scale, Network, Profitability, Fees (with dated basket-fee calculator), Verdict, Data & Sources. Build in the phases listed in section 10, run the dev server and fix all errors after each phase, then finish with the README provided.

---

## 1. Goal
Give visitors one place to see how India's four quick-commerce apps actually differ (scale, network, profitability, fees) using real, cited numbers, with honest labelling of what is reported, derived, or only a company claim.

**Success criteria**
- Every figure traceable to a source link in one click
- No fabricated values anywhere; missing data shown as "Not disclosed"
- Filters affect every chart; any view shareable by URL
- Lighthouse performance and accessibility above 90
- Live Vercel link plus GitHub repo with README and screenshots

## 2. Users
Recruiters viewing the portfolio (primary), curious consumers, students and analysts.

## 3. Real data provided (already in `/data`)

| File | Contents | Reliability |
|---|---|---|
| `company-metrics.json` | Quarterly NOV/GOV, dark stores, adjusted EBITDA, AOV, users for Blinkit and Instamart (Q1 FY26 to Q1 FY27, some quarters partial); Zepto FY26 annual plus Q2/Q4 FY26 order metrics from its DRHP; Flipkart Minutes Sep 2026 snapshot (company statements and press estimates). Includes embedded `sources` and a `confidence` per row | Mostly high; rows marked `medium` come from secondary summaries |
| `network-top10-cities.json` | CLSA count of dark stores in India's top 10 cities, Aug 2026: Blinkit 969, Zepto 828, Flipkart Minutes 627, Instamart 615, BigBasket 497. The only like-for-like store comparison across all players | High |
| `fees-snapshot.json` | Delivery, handling and small-cart fees, **November 2025 snapshot** | Medium and **stale-prone**. Must show the date everywhere |

**Headline facts already verified from the data (usable as seed insights):**
- Blinkit Q1 FY27 NOV ₹17,132 crore vs Instamart NOV ₹5,817 crore, about 2.9x
- Blinkit 2,443 dark stores vs Instamart 1,171 (about 2.1x); Blinkit adjusted EBITDA +₹102 crore (0.6% of NOV) vs Instamart adjusted EBITDA loss ₹778 crore (-9.8% of GOV)
- Zepto FY26: 1,139 dark stores, 66 cities, 2.33M orders/day (Q4), net loss ₹5,905 crore vs ₹4,700 crore in FY25 (about +26%)
- Flipkart Minutes: over 1,000 dark stores, 130 cities (company statement), targeting 1,500 by end 2026
- Nov 2025 small-order fees (under ₹99): Zepto ₹30, Blinkit ₹54, Instamart about ₹55 in extra charges

**Data limits the UI must state openly**
1. Periods differ (Blinkit, Instamart quarterly; Zepto annual; Flipkart Minutes snapshot). Show a "reporting basis" chip on every chart.
2. GOV and NOV are different measures. Compare NOV to NOV, GOV to GOV only.
3. Flipkart Minutes has no financials, and Zepto is unlisted (its IPO is paused, listing expected around Feb–May 2027), so their data is thinner.
4. Zepto revenue is quoted inconsistently across sources (about ₹22,624 crore in most, ₹11,550 crore "operating revenue" in TechCrunch). Show it only with a "sources differ" warning, or omit it.
5. No public data was found for delivery speed or user ratings, so there are **no Speed or Users tabs** in v1.

## 4. Tech Stack
| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | Native Vercel support, static rendering, type safety |
| Styling / UI | Tailwind CSS + shadcn/ui | Fast, consistent, accessible components |
| Charts | Recharts | Interactive bar, line, radar, donut, stacked charts |
| Animation | Framer Motion | Smooth transitions |
| State | nuqs | Filters in the URL, shareable links |
| Validation | Zod | Build fails if a data file is malformed or a source is missing |
| Hosting | Vercel | Free, auto-deploy from GitHub |

## 5. Data Model (matches the files in `/data`)
- **`company-metrics.json`**: `{ meta, apps[], quarterly[], annual[], sources[] }`. Each row has `appId`, period, numeric fields (nullable), `confidence` (`high` / `medium`), optional `note`, and `sources[]` ids that resolve to the embedded `sources` array. App ids: `blinkit`, `zepto`, `instamart`, `flipkart_minutes`.
- **`network-top10-cities.json`**: `{ meta, rows[{appId, darkStoresTop10}], totalTop10, sources[] }`. BigBasket appears as a reference bar only.
- **`fees-snapshot.json`**: `{ meta{asOf, staleWarning}, small_order_under_99[], example_basket_84_rupees_total_paid[], free_delivery_threshold[], sources[] }`.
- **Derived metrics** (computed in `lib/derive.ts`, always badged "Derived" with the formula in a tooltip): NOV per closing store per day = NOV / darkStores / 91; adjusted EBITDA % of NOV; net-loss change YoY; store share of top-10 network.

**Data-quality badges (mandatory on every figure):** `Reported`, `Derived`, `Approx`, `Company claim`, `Secondary source`, `Snapshot (dated)`.

## 6. Features

### 6.1 Global
- Header with tabs, dark-mode toggle, "Copy link" button
- Sticky filter bar: app multi-select, period (Q1 FY26 … Q1 FY27), metric type
- Persistent notice: "Figures compiled from public company filings and press reports, dated 23–24 Sep 2026. Not affiliated with any of these companies."
- Every card and chart has a small "Source" popover listing the source links

### 6.2 Overview
- Headline insight line (from the verified facts above, updating with filters)
- KPI cards per app: dark stores, latest NOV or GOV, adjusted EBITDA, with badges
- Four app cards: "what stands out" (e.g. Blinkit: first profitable quarter streak; Instamart: contribution breakeven in May 2026; Zepto: fastest order growth but widening loss; Flipkart Minutes: fastest store expansion)

### 6.3 Scale
- Line chart: Blinkit NOV and Instamart GOV/NOV over available quarters
- Bar chart: latest NOV Blinkit vs Instamart (like-for-like only)
- Zepto shown in its own FY26 panel (orders, orders/day, users, loss) so it is not mixed with quarterly values
- Toggle: NOV, GOV, orders

### 6.4 Network
- Bar chart of top-10-city dark stores (CLSA), the like-for-like view
- National store counts: Blinkit 2,443, Instamart 1,171, Zepto 1,139, Flipkart Minutes over 1,000 (claim), with badges
- Store growth over time (Blinkit 1,544 → 2,443; Instamart 1,062 → 1,171)
- Cities covered where disclosed (Instamart 131, Zepto 66, Flipkart Minutes about 130, claim)

### 6.5 Profitability
- Adjusted EBITDA by quarter for Blinkit and Instamart (Blinkit: -162 → 4 → 37 → 102; Instamart: -896 → -778)
- EBITDA as % of NOV or GOV
- Instamart contribution margin path; Zepto net loss FY25 vs FY26 in its own panel
- Note where a company reports a metric the others don't

### 6.6 Fees (dated snapshot)
- Prominent banner: "Nov 2025 snapshot. Fees change often. Verify in the app."
- Fee breakdown chart for orders under ₹99 (delivery, small cart, handling)
- **Basket-fee calculator**: user picks an order value; shows fee-only cost per app using the snapshot rules (free-delivery thresholds ₹99 Zepto, ₹199 Blinkit and Instamart); Flipkart Minutes shown as "Not available"
- Example: ₹84 order total paid, Zepto about ₹115.5, Blinkit about ₹143, Instamart about ₹154

### 6.7 Verdict
- **"Who leads at what" table**: each row is a criterion, the leader, the number, the source, and the badge (Network size, Growth, Profitability trend, Fee friendliness (dated), Coverage)
- **Priority sliders** (0 to 10) for Network, Growth, Profitability, Fees. Scores are min-max normalised **only across apps that have data**; apps without data for a criterion show "n/a" and the ranking states "based on N of 4 criteria". Never impute missing values
- Radar chart plus live leaderboard; presets: "Cheap fees", "Big network", "Balanced"

### 6.8 Data & Sources
- Table of every source with publisher, date, link, and which figures use it
- Reliability tiers explained, known conflicts listed (Blinkit NOV typo in one outlet, Zepto revenue disagreement)
- "How to update the data" section (see README)

## 7. Design
Minimal, editorial, generous whitespace, large tabular numerals (Inter). One fixed colour per app across all charts. WCAG AA contrast, keyboard navigation, reduced-motion support. Mobile: filters collapse to a bottom sheet, tabs become a scrollable pill bar, tables scroll horizontally. No official logos; use text names and colour chips.

## 8. Non-Functional
Static generation and code-split charts; strict TypeScript, ESLint, Prettier; Open Graph image via `next/og`; **Zod schemas fail the build if any figure lacks a source id**.

## 9. Structure
```
app/            page.tsx (Overview), scale/, network/, profitability/, fees/, verdict/, sources/
components/     charts/, filters/, kpi-card.tsx, quality-badge.tsx, source-popover.tsx, fee-calculator.tsx, verdict-scorecard.tsx
data/           company-metrics.json, network-top10-cities.json, fees-snapshot.json
lib/            types.ts, schemas.ts (Zod), data.ts, derive.ts, scoring.ts
README.md  PRD.md
```

## 10. Build Phases
1. Scaffold Next.js + Tailwind + shadcn/ui, theme, layout, dark mode, brand colours
2. Types, Zod schemas, data loaders, derived-metric functions, quality badge and source popover components
3. Filters + Overview
4. Scale + Network
5. Profitability
6. Fees + calculator
7. Verdict
8. Data & Sources page, Open Graph image, accessibility and polish
9. README, screenshots, verify `npm run build` passes

After each phase run the dev server, fix all type and lint errors, and check mobile and desktop.

## 11. Acceptance Checklist
- [ ] `npm run build` passes with no errors
- [ ] No hard-coded numbers in components; everything comes from `/data`
- [ ] Every figure has a badge and a working source link
- [ ] Null values render as "Not disclosed"
- [ ] Fee pages show the Nov 2025 date and warning
- [ ] Verdict ranking never imputes missing data
- [ ] Reporting-basis chip on each chart
- [ ] Dark mode and mobile layouts correct; URL sharing reproduces a view
- [ ] Deployed on Vercel

## 12. Maintenance and v2
- Update `/data` after each quarterly result (Eternal and Swiggy report Q2 FY27 in roughly late Oct to Nov 2026); Zepto once it lists
- Re-check fees against the apps before publishing anything about them
- v2 ideas: delivery-speed and Play Store rating/sentiment tabs from data you collect yourself, city-level map, head-to-head mode
