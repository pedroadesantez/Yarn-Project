import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import api from '../utils/api'

export default function Product() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState('')
  const [qty, setQty] = useState(1)
  const [mbQty, setMbQty] = useState(1)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [related, setRelated] = useState([])
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [zoomedIn, setZoomedIn] = useState(false)

  const { addToCart } = useCart()
  const { updateCartCount, isAuthenticated } = useAuth()
  const { success: showSuccess, error: showError } = useToast()

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      const productData = await api.products.detail(id)
      setProduct(productData)
      setSelectedVariant(productData.colors?.[0] || '')

      // Load related products (same category)
      const relatedData = await api.products.list({ category: productData.category })
      setRelated((relatedData.items || []).filter(p => p.id !== productData.id).slice(0, 4))

      // Track recently viewed
      const recent = JSON.parse(localStorage.getItem('recent') || '[]')
      const newRecent = [productData.id, ...recent.filter(pid => pid !== productData.id)].slice(0, 8)
      localStorage.setItem('recent', JSON.stringify(newRecent))

      // Load recently viewed products
      const allProducts = await api.products.list({})
      const recentProducts = newRecent
        .map(pid => allProducts.items.find(p => p.id === pid))
        .filter(Boolean)
        .filter(p => p.id !== productData.id)
        .slice(0, 4)
      setRecentlyViewed(recentProducts)
    } catch (error) {
      console.error('Error loading product:', error)
    }
  }

  const handleAddToCart = async (quantity) => {
    try {
      await addToCart({ productId: product.id, variant: selectedVariant, qty: quantity })
      showSuccess('Added to cart')

      const userData = await api.auth.me().catch(() => null)
      if (userData) {
        updateCartCount(userData.cartCount || 0)
      }
    } catch (error) {
      // Guest cart fallback
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]')
      guestCart.push({ productId: product.id, variant: selectedVariant, qty: quantity })
      localStorage.setItem('guestCart', JSON.stringify(guestCart))
      const count = guestCart.reduce((sum, i) => sum + i.qty, 0)
      updateCartCount(count)
      showSuccess('Added to cart (saved for login)')
    }
  }

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      showError('Please sign in first')
      return
    }

    try {
      await api.wishlist.add(product.id)
      showSuccess('Added to wishlist')
    } catch (error) {
      showError('Failed to add to wishlist')
    }
  }

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      showError('Please sign in to review')
      return
    }

    try {
      await api.products.addReview(product.id, { rating, text: reviewText })
      showSuccess('Review submitted!')
      setReviewText('')
      loadProduct() // Reload to show new review
    } catch (error) {
      showError('Failed to submit review')
    }
  }

  const handleKeyDown = (e) => {
    if (!product?.images) return
    const images = product.images

    if (e.key === 'Escape') setZoomedIn(false)
    if (e.key === 'ArrowRight') setSelectedImage((prev) => (prev + 1) % images.length)
    if (e.key === 'ArrowLeft') setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [product])

  if (!product) {
    return (
      <div className="container">
        <div className="muted">Loading...</div>
      </div>
    )
  }

  const images = product.images || ['/images/placeholder.svg']

  return (
    <>
      <div className="container">
        <div className="split" style={{ marginTop: '16px' }}>
          {/* Gallery */}
          <div className="product-gallery">
            <div
              className={`main-image ${zoomedIn ? 'zoom' : ''}`}
              onClick={() => setZoomedIn(!zoomedIn)}
            >
              <img src={images[selectedImage]} alt={product.name} />
            </div>
            <div className="thumbs">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  aria-selected={i === selectedImage}
                  onClick={() => setSelectedImage(i)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1>{product.name}</h1>
            <div className="price">${product.price.toFixed(2)}</div>
            <div className="muted">In stock: {product.stock || 0}</div>
            <p>{product.description || ''}</p>

            {/* Color/Variant Selector */}
            <div style={{ margin: '12px 0' }}>
              <label className="muted" style={{ display: 'block', marginBottom: '6px' }}>
                Choose color
              </label>
              <select
                className="input select"
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
              >
                {(product.colors || ['default']).map(color => (
                  <option key={color} value={color} style={{ textTransform: 'capitalize' }}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Swatches */}
            {product.colors && (
              <div className="swatches">
                {product.colors.map(color => (
                  <button
                    key={color}
                    className="swatch"
                    title={color}
                    aria-selected={selectedVariant === color}
                    style={{ background: color.replace('pastel-', '') }}
                    onClick={() => setSelectedVariant(color)}
                  />
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="row" style={{ margin: '12px 0' }}>
              <label className="muted" style={{ marginRight: '8px' }}>Quantity</label>
              <div className="qty">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <input value={qty} readOnly min="1" />
                <button onClick={() => setQty(qty + 1)}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div>
              <button className="btn" onClick={() => handleAddToCart(qty)}>
                Add to cart
              </button>
              <button className="pill" onClick={handleAddToWishlist}>
                ♥ Wishlist
              </button>
            </div>

            {/* Reviews */}
            <div style={{ marginTop: '24px' }}>
              <h3>Reviews</h3>
              <div>
                {(product.reviews || []).map((review, i) => (
                  <div key={i} className="muted">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} — {review.text}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '8px' }}>
                <select
                  className="input select"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value="5">★★★★★</option>
                  <option value="4">★★★★☆</option>
                  <option value="3">★★★☆☆</option>
                  <option value="2">★★☆☆☆</option>
                  <option value="1">★☆☆☆☆</option>
                </select>
                <input
                  className="input"
                  placeholder="Share your thoughts"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                <button className="btn" onClick={handleSubmitReview}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Items */}
        <section>
          <div className="section-title"><h2>Related items</h2></div>
          <div className="grid">
            {related.map(item => (
              <Link key={item.id} className="card" to={`/product/${item.id}`}>
                <img src={item.images?.[0] || '/images/placeholder.svg'} alt={item.name} />
                <div className="pad">
                  <div>{item.name}</div>
                  <div className="price">${item.price.toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section>
            <div className="section-title"><h2>Recently viewed</h2></div>
            <div className="grid">
              {recentlyViewed.map(item => (
                <Link key={item.id} className="card" to={`/product/${item.id}`}>
                  <img src={item.images?.[0] || '/images/placeholder.svg'} alt={item.name} />
                  <div className="pad">
                    <div>{item.name}</div>
                    <div className="price">${item.price.toFixed(2)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Add Bar */}
      <div className="addbar">
        <div className="container row">
          <div className="spacer"></div>
          <div className="qty">
            <button onClick={() => setMbQty(Math.max(1, mbQty - 1))}>−</button>
            <input value={mbQty} readOnly min="1" />
            <button onClick={() => setMbQty(mbQty + 1)}>+</button>
          </div>
          <button className="btn" onClick={() => handleAddToCart(mbQty)}>
            Add to cart
          </button>
        </div>
      </div>
    </>
  )
}
