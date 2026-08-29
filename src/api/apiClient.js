/**
 * API Client with caching and error handling
 */
const CACHE_DURATION = 5 * 60 * 1000
const cache = new Map()
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()
const API_URL = configuredApiUrl || 'http://localhost:5000/api'

function getApiUrl() {
  if (!configuredApiUrl && import.meta.env.PROD) {
    throw new Error('The API is not configured. Set VITE_API_URL in the frontend deployment and redeploy.')
  }
  return API_URL
}

export async function apiRequest(path, options = {}) {
  const token = window.localStorage.getItem('walleto_token')
  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const data = response.status === 204 ? null : await response.json()
  if (!response.ok) throw new Error(data?.error || `Request failed: ${response.status}`)
  return data
}

export async function fetchWithCache(url, options = {}, cacheTime = CACHE_DURATION) {
  const token = window.localStorage.getItem('walleto_token')
  const cacheKey = `${url}-${token}-${JSON.stringify(options)}`

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