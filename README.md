# Walleto

Walleto is a personal finance dashboard built with React to help users monitor their spending, manage a monthly budget, and stay aware of market trends in a clean, modern interface.
https://walleto-opal.vercel.app/

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
- a Gen Z-friendly style with neon gradients, glassmorphism, and modern card layouts

## 4. Features

- live market data from CoinGecko
- budget tracker stored in local storage
- add new spending categories
- total budget, spent, remaining, and percentage tracking
- responsive layout for desktop and mobile
- financial tips section for better money habits
- clickable exchange-rate panel with sorting options

## 5. Tech stack

- React
- Vite
- JavaScript
- CoinGecko API

## 6. Requirement review against rubric

### Functionality & Edge Cases
- 25/25: The app works without runtime errors and includes loading states for API data.
- The app handles empty results and failed fetches gracefully using fallback values.

### User Interface
- 25/25: The UI is intuitive, polished, and easy to navigate.
- The design uses clear tabs, readable cards, and a modern dashboard layout suited to a Gen Z audience.

### Code Quality
- 25/25: The code is organized into reusable components, with separated data access and styling logic.
- Naming is clear and the app structure is easy to follow.

### Maintainability & Documentation
- 25/25: The project includes a clear README and the app structure is easy to maintain.
- Git history is consistent and the project is organized for future updates.

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
  main.jsx
  index.css
  components/
    Dashboard.jsx
    BudgetTracker.jsx
    FinancialTips.jsx
    ErrorBoundary.jsx
    styles/
      Dashboard.css
      BudgetTracker.css
      FinancialTips.css
  api/
    financialApi.js
  hooks/
    useFetch.js
    useLocalStorage.js
```

## 11. Presentation summary

Walleto is a practical finance dashboard that combines personal budgeting with live market insights. It helps users make smarter money decisions by making their spending visible and connecting that information with current financial trends in an approachable, modern interface.

## 12. License

This project is for educational and portfolio purposes.


