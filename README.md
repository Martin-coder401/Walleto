# Walleto

Walleto is a personal finance dashboard built with React to help users monitor their spending, manage a monthly budget, and stay aware of recent market movement in a clean, modern interface.

## 1. External API used

This app uses the public CoinGecko API for live market data.

- API: https://api.coingecko.com/api/v3/coins/markets
- Purpose: fetch current crypto market prices and 24-hour changes
- Why it fits: no API key required, easy-to-read JSON, and useful for a realistic financial dashboard

## 2. User goal

The app is designed to help a user:

- track how monthly spending is distributed across categories
- see how major digital assets are performing
- understand financial trends before making money decisions
- access simple financial advice in one place

## 3. App design

Walleto includes:

- a financial dashboard with summary cards
- budget tracking by category
- spending vs. budget progress bars
- quick financial tips and inspiration
- smooth glass-style UI for a polished dashboard feel

## 4. Features

- live market data from CoinGecko
- budget tracker stored in local storage
- add new spending categories
- total budget, spent, remaining, and percentage tracking
- responsive layout for desktop and mobile
- financial tips section for better money habits

## 5. Tech stack

- React
- Vite
- JavaScript
- CoinGecko API

## 7. Getting started

```bash
git clone https://github.com/Martin-coder401/Walleto.git
cd Walleto
npm install
npm run dev
```

## 8. Available scripts

```bash
npm run dev
npm run build
npm run preview
```

## 9. Production build

```bash
npm run build
```

This generates the dist folder for deployment.

## 10. Project structure

```text
src/
  App.jsx
  App.css
  components/
    Dashboard.jsx
    BudgetTracker.jsx
    FinancialTips.jsx
    ErrorBoundary.jsx
  api/
    financialApi.js
  hooks/
    useFetch.js
    useLocalStorage.js
```

## 11. Presentation summary

Walleto is a practical finance dashboard that combines personal budgeting with live market insights. It helps users make smarter money decisions by making their spending visible and connecting that information with current financial trends in an approachable, modern interface.



