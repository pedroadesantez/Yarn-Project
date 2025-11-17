import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, getProductById, loadCart, removeFromCart } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isOpen) {
      loadCart()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, loadCart])

  const handleRemove = async (index) => {
    try {
      await removeFromCart(index)
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  if (!isOpen) return null

  const subtotal = cartItems.reduce((sum, item) => {
    const product = getProductById(item.productId)
    return sum + (product?.price || 0) * (item.qty || 0)
  }, 0)

  return (
    <>
      <div className={`backdrop ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <aside className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="head">
          <strong>Your Cart</strong>
          <button className="pill" onClick={onClose}>Close</button>
        </div>
        <div className="body" id="cartBody">
          {!isAuthenticated ? (
            <div className="muted">Please sign in to view your cart.</div>
          ) : cartItems.length === 0 ? (
            <div className="muted">Your cart is empty.</div>
          ) : (
            cartItems.map((item, index) => {
              const product = getProductById(item.productId) || {
                name: 'Unknown',
                price: 0,
                images: ['/images/placeholder.svg']
              }

              return (
                <div key={index} className="line">
                  <img
                    src={product.images?.[0] || '/images/placeholder.svg'}
                    alt={product.name}
                  />
                  <div className="grow">
                    <div><strong>{product.name}</strong></div>
                    <div className="muted">{item.variant || ''}</div>
                  </div>
                  <div className="qty">x{item.qty}</div>
                  <button
                    className="remove"
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </button>
                </div>
              )
            })
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="foot">
            <div className="muted" style={{ marginBottom: '8px' }}>
              Subtotal: ${subtotal.toFixed(2)}
            </div>
            <div className="row">
              <div className="spacer"></div>
              <Link className="btn" to="/cart" onClick={onClose}>
                View Cart
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
