import { useCallback, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading localStorage:', error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      setStoredValue((currentValue) => {
        const valueToStore = value instanceof Function ? value(currentValue) : value
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
        return valueToStore
      })
    } catch (error) {
      console.error('Error setting localStorage:', error)
    }
  }, [key])

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error('Error removing localStorage:', error)
    }
  }

  return [storedValue, setValue, removeValue]
}