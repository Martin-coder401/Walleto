import React, { useMemo, useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { fetchStockData, fetchExchangeRates, fetchFinancialNews } from '../api/financialApi'
import LoadingSpinner from './LoadingSpinner'
import './styles/Dashboard.css'

function Dashboard() {
  const { data: stocks, loading: stocksLoading } = useFetch(fetchStockData)
  const { data: rates, loading: ratesLoading } = useFetch(fetchExchangeRates)
  const { data: news, loading: newsLoading } = useFetch(fetchFinancialNews)
  const [ratesExpanded, setRatesExpanded] = useState(false)
  const [ratesSort, setRatesSort] = useState('value')

  const sortedRates = useMemo(() => {
    if (!rates) return []

    return Object.entries(rates).sort((a, b) => {
      const [currencyA] = a
      const [currencyB] = b

      if (ratesSort === 'alphabet') {
        return currencyA.localeCompare(currencyB)
      }

      return Number(b[1]) - Number(a[1])
    })
  }, [rates, ratesSort])

  if (stocksLoading || ratesLoading || newsLoading) {
    return <LoadingSpinner message="Loading your financial dashboard..." />
  }

  const totalValue = stocks?.reduce((sum, stock) => sum + stock.price * 10, 0) || 0
  const totalChange = stocks?.reduce((sum, stock) => sum + stock.change * 10, 0) || 0

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <h2> Financial Dashboard</h2>
        <p className="subtitle">Real-time market data and insights</p>
      </div>

      <div className="portfolio-summary">
        <div className="summary-card">
          <h4> Portfolio Value</h4>
          <p className="value">${totalValue.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h4> Today's Change</h4>
          <p className={`value ${totalChange >= 0 ? 'positive' : 'negative'}`}>
            {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}
          </p>
        </div>
        <div className="summary-card">
          <h4> Total Holdings</h4>
          <p className="value">{stocks?.length || 0} Stocks</p>
        </div>
      </div>

      <div className="section">
        <h3> Market Snapshot</h3>
        <div className="stock-grid">
          {stocks?.map((stock) => (
            <div key={stock.symbol} className="stock-card">
              <div className="stock-symbol">{stock.symbol}</div>
              <div className="stock-price">${stock.price.toFixed(2)}</div>
              <div className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                {stock.change >= 0 ? '↑' : '↓'} {Math.abs(stock.change).toFixed(2)} ({stock.changePercent}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h3> Exchange Rates</h3>
          <div className="rates-toolbar">
            <button
              type="button"
              className="rates-toggle"
              onClick={() => setRatesExpanded((prev) => !prev)}
            >
              {ratesExpanded ? 'Hide rates' : 'View all rates'}
            </button>
            <select
              className="sort-select"
              value={ratesSort}
              onChange={(event) => setRatesSort(event.target.value)}
              aria-label="Sort exchange rates"
            >
              <option value="value">Sort by value</option>
              <option value="alphabet">Sort A–Z</option>
            </select>
          </div>
        </div>

        {ratesExpanded && (
          <div className="rates-grid">
            {sortedRates.map(([currency, rate]) => (
              <button key={currency} type="button" className="rate-card" title={`${currency}: ${Number(rate).toFixed(4)}`}>
                <span className="currency">{currency}</span>
                <span className="rate">{Number(rate).toFixed(4)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h3> Financial News</h3>
        <div className="news-list">
          {news?.map((item) => (
            <div key={item.id} className="news-item">
              <h4>{item.title}</h4>
              <div className="news-meta">
                <span className="source">{item.source}</span>
                <span className="time">{new Date(item.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard