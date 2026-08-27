# Walleto

Walleto is a full-stack personal finance workspace built with React and Flask. Authenticated users can manage private budgets and transactions while watching market trends in a clean, modern interface.
https://walleto-opal.vercel.app/

The frontend uses `VITE_API_URL` for the deployed Flask API. The production deployment below uses Render for the backend and PostgreSQL; the existing Vercel frontend can remain as-is after setting that variable.

## Project brief

Walleto helps people make a practical monthly money plan: create spending budgets, record transactions, compare actual spending with limits, and use market context as a learning aid. Every budget and transaction belongs to the signed-in user and is protected by the API.

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
- Flask, Flask-SQLAlchemy, Flask-JWT-Extended, and PostgreSQL (SQLite is the local default)
- CoinGecko API

## 6. Authentication and API

The Flask service exposes JWT authentication and ownership-scoped CRUD resources:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Return a JWT |
| GET, POST | `/api/budgets` | List or create the current user's budgets |
| PATCH, DELETE | `/api/budgets/:id` | Update or delete an owned budget |
| GET, POST | `/api/transactions` | List or create the current user's transactions |
| PATCH, DELETE | `/api/transactions/:id` | Update or delete an owned transaction |

Protected requests require `Authorization: Bearer <token>`. Resource queries always filter by the authenticated user's ID, so an ID from another account cannot be edited or deleted.

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
export JWT_SECRET_KEY="use-a-long-random-value"
# Set DATABASE_URL to a PostgreSQL URL for production; SQLite is used otherwise.
python3 app.py
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

## 10. Deploy the API and connect the frontend

This repository includes `render.yaml` for deploying the Flask API and a PostgreSQL database on Render:

1. In Render, create a new Blueprint from this repository and apply `render.yaml`.
2. After the `walleto-api` service is created, copy its public URL, such as `https://walleto-api.onrender.com`.
3. In the Vercel project settings, add the production environment variable `VITE_API_URL` with the value `https://walleto-api.onrender.com/api`.
4. Redeploy the Vercel frontend.

`FRONTEND_ORIGIN` is already set in `render.yaml` to the current Vercel URL. Change it if the frontend uses a different production domain. The API health check is available at `/api/health`.

## 11. Project structure

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

## 12. Presentation summary

Walleto is a practical finance dashboard that combines personal budgeting with live market insights. It helps users make smarter money decisions by making their spending visible and connecting that information with current financial trends in an approachable, modern interface.

## 13. License

This project is for educational and portfolio purposes.


