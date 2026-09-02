# Walleto

Walleto is a full-stack personal finance workspace built with React and Flask. Users can open the app directly, manage budget categories, track spending, convert amounts to Kenyan shillings, and view live market information without logging in.
https://walleto-opal.vercel.app/
walleto video link recording https://www.loom.com/share/6b438abad1d44b44a080407ca7ba9b6a

The frontend uses `VITE_API_URL` for the deployed Flask API. The production deployment uses Vercel for the frontend, Render for the Flask backend, and PostgreSQL for persistent budget data.

## Project brief

Walleto helps people make a practical monthly money plan: create spending budgets, compare actual spending with limits, convert totals between USD and KES, and use market context as a learning aid.

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

- a financial dashboard with summary cards and live market data
- budget tracking by category with spending-versus-limit progress bars
- a warm gold money-inspired interface with a subtle banknote watermark
- quick financial tips and money-management guidance
- responsive navigation and layouts for desktop and mobile

## 4. Features

- live cryptocurrency market data from CoinGecko
- live exchange rates with sortable rate cards
- add new spending categories through an expandable form
- total budget, total spent, remaining balance, and percentage-used summaries
- explicit Update and Delete controls for budget spending values
- USD and Kenyan shilling (KES) display conversion
- backend persistence through the Flask API, with local storage fallback when the API is unavailable
- loading, empty-response, failed-request, and reduced-motion handling

## 5. Tech stack

- React
- Vite
- JavaScript
- Flask, Flask-SQLAlchemy, and PostgreSQL (SQLite is the local default)
- CoinGecko API

## 6. API

The Flask service provides a health check and budget CRUD endpoints. The budget endpoints support direct app access and use a shared guest record for visitors:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Confirm that the API is running |
| GET, POST | `/api/budgets` | List or create budgets |
| PATCH, DELETE | `/api/budgets/:id` | Update or delete a budget |

Budget values are stored in USD. Currency conversion is a presentation feature in the frontend, using the exchange-rate service.

## 7. Getting started

```bash
git clone https://github.com/Martin-coder401/Walleto.git
cd Walleto
npm install
npm run dev
```

In a second terminal, start the API:

```bash
cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt

python3 app.py
```

## 8. Available scripts

```bash
npm run dev
npm run build
npm run preview
```


## 9. Quality and maintainability

- Components are separated by responsibility: dashboard, budgeting, financial tips, loading, and error handling.
- API helpers keep remote requests separate from presentation components.
- `useFetch` handles loading and failed external requests; financial API helpers provide safe fallback values.
- `useLocalStorage` keeps budget work available when the backend is temporarily unavailable.
- The interface uses clear navigation, labeled actions, responsive layouts, and accessible form labels.
- `npm run build` verifies that the production frontend compiles successfully.
- The commit history documents incremental work across backend deployment, API integration, editing controls, currency conversion, visual design, and the browser favicon.

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


