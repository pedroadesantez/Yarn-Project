import { createContext, useState, useCallback } from 'react'

export const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    const newToast = { id, message, type }

    setToasts(prev => [...prev, newToast])

    // Auto remove after 2.2 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 2200)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const value = {
    toasts,
    showToast,
    removeToast,
    success: (message) => showToast(message, 'success'),
    error: (message) => showToast(message, 'error'),
    info: (message) => showToast(message, 'info'),
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
