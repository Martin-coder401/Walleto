const COIN_GECKO_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano,dogecoin&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h'
const EXCHANGE_RATE_URL = 'https://open.er-api.com/v6/latest/USD'

function transformMarketData(rawCoins) {
  return rawCoins.map((coin) => ({
    symbol: coin.symbol.toUpperCase(),
    price: Number(coin.current_price) || 0,
    change: Number(coin.price_change_24h) || 0,
    changePercent: Number(coin.price_change_percentage_24h) || 0,
    name: coin.name,
  }))
}

export async function fetchStockData() {
  try {
    const response = await fetch(COIN_GECKO_URL)

    if (!response.ok) {
      throw new Error(`Market data request failed: ${response.status}`)
    }

    const data = await response.json()
    return transformMarketData(data)
  } catch (error) {
    console.error('Error fetching stock data:', error)
    return []
  }
}

export async function fetchExchangeRates() {
  try {
    const response = await fetch(EXCHANGE_RATE_URL)

    if (!response.ok) {
      throw new Error(`Exchange rate request failed: ${response.status}`)
    }

    const data = await response.json()
    return data?.rates || {}
  } catch (error) {
    console.error('Error fetching exchange rates:', error)
    return {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 157.1,
      CAD: 1.36,
    }
  }
}

export async function fetchFinancialNews() {
  try {
    const response = await fetch(COIN_GECKO_URL)

    if (!response.ok) {
      throw new Error(`Trending market request failed: ${response.status}`)
    }

    const data = await response.json()

    return data.slice(0, 4).map((coin) => ({
      id: coin.id,
      title: `${coin.name} is showing ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'} momentum`,
      source: 'CoinGecko',
      timestamp: new Date().toISOString(),
    }))
  } catch (error) {
    console.error('Error fetching news:', error)
    return [
      { id: 'fallback-1', title: 'Market data temporarily unavailable', source: 'System', timestamp: new Date().toISOString() },
    ]
  }
}