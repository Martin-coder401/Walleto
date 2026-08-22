import { useState, useEffect, useCallback } from 'react'

export function useFetch(fetchFunction, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchFunction()
      setData(result)
    } catch (err) {
      setError(err.message || 'An error occurred')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [fetchFunction])

  useEffect(() => {
    fetchData()
  }, [fetchData, ...deps])

  return { data, loading, error, refetch: fetchData }
}