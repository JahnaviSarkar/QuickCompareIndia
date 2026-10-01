# QuickCompare India

An interactive, editorial-style dashboard comparing India's four major quick-commerce apps—**Blinkit, Swiggy Instamart, Zepto, and Flipkart Minutes**—using exclusively real, publicly reported data.

## Features

- **No Fabricated Data**: Every single figure displayed on the dashboard comes from official company filings, DRHPs, or verified press reports.
- **Deep-Dive Dashboards**: Navigate through dedicated pages for Scale, Network, Profitability, and Consumer Fees.
- **Data Quality Badges**: Every chart explicitly highlights its reporting basis (e.g. "Reported", "Snapshot (dated)", "Company claim") and provides a one-click source popover.
- **Interactive Verdict**: Adjust priority sliders (Network, Growth, Profitability, Fees) to generate a personalized radar chart and leaderboard.
- **Shareable Links**: Current filter selections (apps to compare, time periods) are synced to the URL, making views instantly shareable.
- **Accessible & Responsive**: Full dark mode support, mobile-friendly layouts, and keyboard accessible components.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Visualizations:** Recharts + Framer Motion
- **State Management:** `nuqs` (URL-synced state)
- **Validation:** Zod (strict data schema enforcement)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

## How to Update the Data

All metrics are driven by static JSON files located in the `data/` directory. There is no backend or database required.

1. **`data/company-metrics.json`**: Update this file with new quarterly/annual results.
2. **`data/fees-snapshot.json`**: Modify to reflect current consumer delivery fees.
3. **`data/network-top10-cities.json`**: Update city-level dark store counts.

Any new source links must be added to the `sources` array at the bottom of the relevant JSON file. The dashboard's tables, charts, and Verdict leaderboard will automatically recalculate.

## License

This project is for educational and analytical purposes. We are not affiliated with Eternal, Swiggy, Zepto, or Flipkart.
