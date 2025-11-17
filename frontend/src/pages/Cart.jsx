import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useToast } from '../hooks/useToast'
import api from '../utils/api'

export default function Cart() {
  const { isAuthenticated } = useAuth()
  const { cartItems, products, loadCart, clearCart, getProductById } = useCart()
  const [coupon, setCoupon] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('mock')
  const [loading, setLoading] = useState(false)
  const { success: showSuccess, error: showError } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      loadCart()
    }
  }, [isAuthenticated, loadCart])

  const subtotal = cartItems.reduce((sum, item) => {
    const product = getProductById(item.productId)
    return sum + (product?.price || 0) * (item.qty || 0)
  }, 0)

  const shipping = 6.99
  const total = subtotal + shipping

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setLoading(true)

    try {
      // Checkout
      const { orderId } = await api.orders.checkout({
        coupon: coupon || undefined,
        method: paymentMethod
      })

      // Pay
      await api.orders.pay(orderId, {})

      showSuccess('Payment successful!')
      await clearCart()

      setTimeout(() => {
        navigate('/shop')
      }, 800)
    } catch (error) {
      showError('Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container">
        <h1>Your Cart</h1>
        <div className="muted">
          Please <Link to="/login">sign in</Link> to view your cart.
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <h1>Your Cart</h1>
        <div className="muted">Your cart is empty.</div>
        <Link to="/shop" className="btn" style={{ marginTop: '16px', display: 'inline-block' }}>
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Your Cart</h1>

      <div id="cartItems">
        {cartItems.map((item, index) => {
          const product = getProductById(item.productId) || {
            name: 'Unknown',
            price: 0,
            images: ['/images/placeholder.svg']
          }

          return (
            <div key={index} className="card">
              <div className="pad" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={product.images?.[0] || '/images/placeholder.svg'}
                  alt={product.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div>
                    <strong>{product.name}</strong>{' '}
                    <span className="muted">{item.variant || ''}</span>
                  </div>
                  <div className="muted">Qty {item.qty}</div>
                </div>
                <div className="price">${((product.price || 0) * item.qty).toFixed(2)}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '16px' }}>
        <input
          id="coupon"
          placeholder="Coupon code"
          className="input"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />
        <select
          id="method"
          className="input select"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="mock">Pay (Mock)</option>
          <option value="stripe">Stripe</option>
          <option value="paypal">PayPal</option>
          <option value="mpesa">M-Pesa</option>
        </select>
        <button className="btn" onClick={handleCheckout} disabled={loading}>
          {loading ? 'Processing...' : 'Checkout'}
        </button>
      </div>

      <div id="totals" style={{ marginTop: '16px' }}>
        <div className="card">
          <div className="pad">
            <div>Subtotal: ${subtotal.toFixed(2)}</div>
            <div>Shipping: ${shipping.toFixed(2)}</div>
            <div><strong>Total: ${total.toFixed(2)}</strong></div>
          </div>
        </div>
      </div>
    </div>
  )
}
