# Stock Exchange Simulation Client

React web application for a stock market simulation. Users can browse available stocks, buy and sell positions, track portfolio value, simulate price changes over days, and review budget development with charted cash, portfolio, and total value lines.

The app is built with Vite, React, React Router, Material UI, and Axios. It expects a JSON API backend with `companies` and `stocks` resources.

## Features

- Market overview with searchable stock list
- Add, edit, and delete stock/company data
- Buy and sell shares from a stock detail page
- Portfolio page with current holdings and gains/losses
- Budget page with daily value development chart
- Toggle chart lines for cash, portfolio value, and total value
- Simulation day button that changes stock prices and stores daily budget snapshots
- Local persistence for transactions, day counter, budget history, and chart visibility
- Vercel-compatible single page app routing

## Tech Stack

- React 19
- Vite 8
- React Router
- Material UI
- Axios
- Local Storage for user simulation state
- JSON server or compatible REST API backend

## Requirements

- Node.js
- npm
- Running backend API

The backend must expose these endpoints:

```txt
GET    /companies
GET    /stocks
GET    /stocks/:id?_expand=company
POST   /companies
POST   /stocks
PUT    /companies/:id
PUT    /stocks/:id
DELETE /companies/:id
DELETE /stocks/:id
```

## Environment Setup

Create a local `.env` file in the project root:

```txt
VIT_SERVER_URL=http://localhost:5002
```

For Vercel/production, set the same variable to your deployed backend URL:

```txt
VIT_SERVER_URL=https://your-render-service.onrender.com
```

Do not add `/stocks` or `/companies` to the value. Use only the API base URL.

## Install And Run

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```txt
http://localhost:5173
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## User Manual

### Market

The Market page is the main stock list.

Use the search field to filter by stock symbol, company name, country/location, or branch. Click a stock row to open the buy/sell screen. Use the plus button to create a new stock and company entry. Use the edit and delete icons on each row to update or remove existing data.

### Buy And Sell

The buy/sell page opens after selecting a stock from the Market page.

Choose `Buy` or `Sell`, adjust the quantity with the quantity buttons, and confirm the transaction. Buy operations reduce available cash. Sell operations increase available cash and reduce owned quantity.

Transactions are stored in browser local storage, so they remain available after refresh on the same browser/device.

### Portfolio

The Portfolio page shows current holdings based on all buy and sell transactions.

It displays total holdings value, gain/loss amount, gain/loss percentage, and one row per owned stock. Values are calculated using current stock prices from the backend.

### Budget

The Budget page shows the development of:

- Cash
- Portfolio value
- Total value

The chart uses daily snapshots. A new snapshot is recorded whenever the `Day` button in the top toolbar is pressed. The chart line visibility can be changed with the Cash, Portfolio, and Total checkboxes. These checkbox states are saved locally and survive page reloads.

The timeline below the chart shows the latest daily snapshots in text form.

### Simulation Day

The top toolbar contains a `Day` button. Pressing it:

1. Fetches all stocks from the backend.
2. Applies a random stock price simulation.
3. Saves updated stock prices back to the backend.
4. Records a daily budget snapshot.
5. Advances the day counter.

The reset button next to it clears transactions, budget history, and resets the simulation to Day 1.

### Settings

The Settings page currently acts as a placeholder for future configuration options.

## Local Storage

The app stores simulation data in browser local storage:

```txt
transactions
budgetHistory
budgetVisibleSeries
simulationDay
```

Clearing browser storage resets the local simulation state. Backend stock/company data is not cleared by browser storage.

## Deployment Notes

This project includes `vercel.json` with a rewrite to `index.html`. This is required so React Router routes such as `/portfolio`, `/budget`, and `/buy-and-sell/:stockId` work after a browser refresh on Vercel.

Before deploying, configure this Vercel environment variable:

```txt
VIT_SERVER_URL=https://your-render-service.onrender.com
```

After changing environment variables in Vercel, redeploy the project because Vite reads frontend environment variables at build time.

## Project Structure

```txt
src/
  components/       Reusable UI components
  config/           API base URL config
  context/          Portfolio and transaction state
  pages/            Route pages
  theme.js          Material UI theme
```

Important files:

```txt
src/pages/Market.jsx
src/pages/Portfolio.jsx
src/pages/Budget.jsx
src/pages/BuyAndSell.jsx
src/components/TopToolBar.jsx
src/context/PortfolioContext.jsx
src/config/api.js
```

## Known Limitations

- Transactions and budget history are stored per browser/device in local storage.
- Daily chart history starts only after pressing the `Day` button.
- The backend must allow browser requests from the deployed Vercel domain.
- The app assumes the backend data shape matches the existing `companies` and `stocks` resources.

## Possible Next Steps

- Connect real stock market data from a free or low-cost API, for example Yahoo Finance-style APIs, Alpha Vantage, Finnhub, Twelve Data, or another market data provider.
- Store historical stock prices so each selected stock can show its own price chart over time.
- Add more chart views, such as individual stock price history, portfolio allocation, gain/loss by stock, and performance comparison against the starting budget.
- Replace simulated price changes with real daily price updates when live market data is available.
- Improve stock creation by fetching company metadata automatically instead of entering everything manually.
- Use an LLM-assisted workflow to generate or suggest company logos/icons when new stock data is imported and no logo asset is available.
- Move from JSON server-style persistence to a real database such as PostgreSQL, MongoDB, or Supabase.
- Expand the backend with stronger validation, calculated portfolio endpoints, historical snapshots, and user-specific data.
- Add authentication so each user has a private portfolio, transactions, budget history, and settings.
- Add user roles for admin-only create/update/delete stock data actions.
- Add import/export tools for portfolio history and transaction records.
- Improve production reliability with backend logging, error handling, loading/error states in the UI, and automated tests.
