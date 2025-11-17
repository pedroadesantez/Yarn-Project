import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../utils/api'

export default function Wishlist() {
  const { user, isAuthenticated } = useAuth()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadWishlist()
  }, [isAuthenticated, navigate])

  const loadWishlist = async () => {
    try {
      const [userData, productsData] = await Promise.all([
        api.auth.me(),
        api.products.list({})
      ])

      const wishlist = userData.wishlist || []
      const items = wishlist
        .map(id => productsData.items.find(p => p.id === id))
        .filter(Boolean)

      setWishlistItems(items)
    } catch (error) {
      console.error('Error loading wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <h1>Wishlist</h1>
        <p className="muted">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <div className="muted">No items yet.</div>
      ) : (
        <div className="grid">
          {wishlistItems.map(product => (
            <Link key={product.id} className="card" to={`/product/${product.id}`}>
              <img
                src={product.images?.[0] || '/images/placeholder.svg'}
                alt={product.name}
              />
              <div className="pad">
                <div>{product.name}</div>
                <div className="price">${product.price.toFixed(2)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
