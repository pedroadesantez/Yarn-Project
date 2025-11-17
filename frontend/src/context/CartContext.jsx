import { createContext, useState, useCallback, useContext } from 'react'
import api from '../utils/api'
import { AuthContext } from './AuthContext'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user, updateCartCount } = useContext(AuthContext)
  const [cartItems, setCartItems] = useState([])
  const [products, setProducts] = useState([])

  const loadCart = useCallback(async () => {
    try {
      if (user) {
        // Authenticated user - fetch from API
        const { cart } = await api.cart.view()
        setCartItems(cart || [])

        // Fetch all products for mapping
        const { items } = await api.products.list({})
        setProducts(items || [])

        return cart || []
      } else {
        // Guest user - load from localStorage
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]')
        setCartItems(guestCart)

        // Fetch products for guest cart items
        const { items } = await api.products.list({})
        setProducts(items || [])

        return guestCart
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      return []
    }
  }, [user])

  const addToCart = useCallback(async (item) => {
    try {
      if (user) {
        // Authenticated - use API
        await api.cart.add(item)
        const updatedCart = await loadCart()
        const count = updatedCart.reduce((sum, i) => sum + (i.qty || 0), 0)
        updateCartCount(count)
      } else {
        // Guest - use localStorage
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]')

        // Check if item already exists
        const existingIndex = guestCart.findIndex(
          i => i.productId === item.productId && i.variant === item.variant
        )

        if (existingIndex >= 0) {
          guestCart[existingIndex].qty += item.qty || 1
        } else {
          guestCart.push(item)
        }

        localStorage.setItem('guestCart', JSON.stringify(guestCart))
        setCartItems(guestCart)
        const count = guestCart.reduce((sum, i) => sum + (i.qty || 0), 0)
        updateCartCount(count)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }, [user, loadCart, updateCartCount])

  const updateCart = useCallback(async (updatedCart) => {
    try {
      if (user) {
        // Authenticated - use API
        await api.cart.update({ cart: updatedCart })
        await loadCart()
        const count = updatedCart.reduce((sum, i) => sum + (i.qty || 0), 0)
        updateCartCount(count)
      } else {
        // Guest - use localStorage
        localStorage.setItem('guestCart', JSON.stringify(updatedCart))
        setCartItems(updatedCart)
        const count = updatedCart.reduce((sum, i) => sum + (i.qty || 0), 0)
        updateCartCount(count)
      }
    } catch (error) {
      console.error('Error updating cart:', error)
      throw error
    }
  }, [user, loadCart, updateCartCount])

  const removeFromCart = useCallback(async (index) => {
    try {
      const currentCart = await loadCart()
      currentCart.splice(index, 1)
      await updateCart(currentCart)
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }, [loadCart, updateCart])

  const clearCart = useCallback(async () => {
    try {
      if (user) {
        await api.cart.update({ cart: [] })
      } else {
        localStorage.setItem('guestCart', '[]')
      }
      setCartItems([])
      updateCartCount(0)
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }, [user, updateCartCount])

  const getProductById = useCallback((productId) => {
    return products.find(p => p.id === productId)
  }, [products])

  const value = {
    cartItems,
    products,
    loadCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    getProductById,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
