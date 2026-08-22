const MOCK_DATA = {
  stocks: [
    { symbol: 'AAPL', price: 175.34, change: 1.23, changePercent: 0.71 },
    { symbol: 'GOOGL', price: 141.80, change: 2.45, changePercent: 1.76 },
    { symbol: 'MSFT', price: 378.91, change: -1.23, changePercent: -0.32 },
    { symbol: 'AMZN', price: 145.80, change: 3.12, changePercent: 2.19 },
    { symbol: 'TSLA', price: 245.60, change: -5.67, changePercent: -2.26 },
  ],
  exchangeRates: {
    USD: 1.0000,
    EUR: 0.8500,
    GBP: 0.7300,
    JPY: 110.5000,
    CAD: 1.2500,
    AUD: 1.3500,
    CHF: 0.9200,
    CNY: 6.4500,
  },
  news: [
    {
      id: 1,
      title: 'Tech Stocks Rally on AI Optimism',
      source: 'Bloomberg',
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Federal Reserve Signals Rate Cuts',
      source: 'Reuters',
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Crypto Market Shows Resilience',
      source: 'CoinDesk',
      timestamp: new Date().toISOString(),
    },
    {
      id: 4,
      title: 'Green Energy Investments Surge',
      source: 'CNBC',
      timestamp: new Date().toISOString(),
    },
  ],
}

export async function fetchStockData() {
  try {
    return await new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_DATA.stocks), 500)
    })
  } catch (error) {
    console.error('Error fetching stock data:', error)
    return MOCK_DATA.stocks
  }
}

export async function fetchExchangeRates() {
  try {
    return await new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_DATA.exchangeRates), 500)
    })
  } catch (error) {
    console.error('Error fetching exchange rates:', error)
    return MOCK_DATA.exchangeRates
  }
}

export async function fetchFinancialNews() {
  try {
    return await new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_DATA.news), 500)
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return MOCK_DATA.news
  }
}