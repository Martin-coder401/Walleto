/**
 * API Client with caching and error handling
 */
const CACHE_DURATION = 5 * 60 * 1000
const cache = new Map()

export async function fetchWithCache(url, options = {}, cacheTime = CACHE_DURATION) {
  const cacheKey = `${url}-${JSON.stringify(options)}`

  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey)
    if (Date.now() - timestamp < cacheTime) {
      return data
    }
    cache.delete(cacheKey)
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    cache.set(cacheKey, { data, timestamp: Date.now() })
    return data
  } catch (error) {
    console.error('API fetch error:', error)
    throw error
  }
}

export function clearCache() {
  cache.clear()
}