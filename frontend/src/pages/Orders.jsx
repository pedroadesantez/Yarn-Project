import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Modal from '../components/shared/Modal'
import api from '../utils/api'

export default function Orders() {
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadOrders()
  }, [isAuthenticated, navigate])

  const loadOrders = async () => {
    try {
      const data = await api.orders.list()
      setOrders(data.items || [])
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewOrder = async (orderId) => {
    try {
      const [orderData, productsData] = await Promise.all([
        api.orders.track(orderId),
        api.products.list({})
      ])
      setSelectedOrder(orderData)
      setProducts(productsData.items || [])
    } catch (error) {
      console.error('Error loading order details:', error)
    }
  }

  const getProductById = (productId) => {
    return products.find(p => p.id === productId) || {
      name: 'Unknown',
      price: 0,
      images: ['/images/placeholder.svg']
    }
  }

  if (loading) {
    return (
      <div className="container">
        <h1>Your Orders</h1>
        <div className="muted">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <div className="muted">No orders yet.</div>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id} className="card">
              <div className="pad row">
                <div>
                  <strong>#{order.id}</strong> — {order.status} — ${order.totals.total.toFixed(2)}
                </div>
                <div className="spacer"></div>
                <button className="pill" onClick={() => handleViewOrder(order.id)}>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order #${selectedOrder.id}` : ''}
      >
        {selectedOrder && (
          <div>
            <div className="muted">
              Status: {selectedOrder.status} · Payment: {selectedOrder.payment?.status || 'n/a'}
            </div>
            <div className="muted">Total: ${selectedOrder.totals.total.toFixed(2)}</div>
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '12px 0' }} />

            {/* Order Items */}
            {(selectedOrder.items || []).map((item, index) => {
              const product = getProductById(item.productId)
              return (
                <div key={index} className="line">
                  <img src={product.images?.[0] || '/images/placeholder.svg'} alt={product.name} />
                  <div className="grow">
                    <div>
                      <strong>{product.name}</strong>{' '}
                      <span className="muted">{item.variant || ''}</span>
                    </div>
                    <div className="muted">Qty {item.qty}</div>
                  </div>
                  <div>${((product.price || 0) * item.qty).toFixed(2)}</div>
                </div>
              )
            })}

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '12px 0' }} />

            {/* Timeline */}
            <div><strong>Timeline</strong></div>
            {(selectedOrder.timeline || []).length === 0 ? (
              <div className="muted">No events yet.</div>
            ) : (
              (selectedOrder.timeline || [])
                .slice()
                .sort((a, b) => a.at - b.at)
                .map((event, index) => (
                  <div key={index} className="muted">
                    {new Date(event.at).toLocaleString()} —{' '}
                    {event.type === 'payment' ? 'Payment' : ''}{' '}
                    {event.type === 'status' ? `Status: ${event.status}` : event.status}{' '}
                    {event.note ? `— ${event.note}` : ''}
                  </div>
                ))
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
