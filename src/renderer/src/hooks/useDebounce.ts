import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'

export const useDebounce = (mainFunction, delay) => {
  let timer
  let canceled = false
  const location = useLocation() // Hook to get the current route location

  const debouncedFunction = function (...args) {
    clearTimeout(timer)
    canceled = false

    timer = setTimeout(() => {
      if (!canceled) {
        mainFunction(...args)
      }
    }, delay)
  }

  debouncedFunction.cancel = () => {
    canceled = true
    clearTimeout(timer)
  }

  // Automatically cancel the debounced function when the route changes
  useEffect(() => {
    return () => {
      debouncedFunction.cancel()
    }
  }, [location]) // Re-run effect when the route changes

  return debouncedFunction
}

export const debounce = (mainFunction, delay) => {
  let timer
  let canceled = false

  const debouncedFunction = function (...args) {
    clearTimeout(timer)
    canceled = false

    timer = setTimeout(() => {
      if (!canceled) {
        mainFunction(...args)
      }
    }, delay)
  }

  debouncedFunction.cancel = () => {
    canceled = true
    clearTimeout(timer)
  }

  return debouncedFunction
}
