import { createContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)

  const fetchUser = useCallback(async () => {
    try {
      const userData = await api.auth.me()
      setUser(userData)
      setCartCount(userData.cartCount || 0)
    } catch (error) {
      setUser(null)
      // If not logged in, get guest cart count from localStorage
      try {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]')
        const count = guestCart.reduce((sum, item) => sum + (item.qty || 0), 0)
        setCartCount(count)
      } catch {
        setCartCount(0)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = useCallback(async (credentials) => {
    const data = await api.auth.login(credentials)
    await fetchUser()
    return data
  }, [fetchUser])

  const register = useCallback(async (userData) => {
    const data = await api.auth.register(userData)
    return data
  }, [])

  const logout = useCallback(async () => {
    await api.auth.logout()
    setUser(null)
    setCartCount(0)
    // Clear guest cart on logout
    localStorage.removeItem('guestCart')
  }, [])

  const updateCartCount = useCallback((count) => {
    setCartCount(count)
  }, [])

  const refreshUser = useCallback(() => {
    return fetchUser()
  }, [fetchUser])

  const value = {
    user,
    loading,
    cartCount,
    login,
    register,
    logout,
    updateCartCount,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
