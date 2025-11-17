import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import api from '../utils/api'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [visibleCount, setVisibleCount] = useState(8)

  // Filters
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [color, setColor] = useState(searchParams.get('color') || '')
  const [weight, setWeight] = useState(searchParams.get('weight') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sort, setSort] = useState('popular')

  const { addToCart } = useCart()
  const { updateCartCount } = useAuth()
  const { success: showSuccess } = useToast()

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchParams])

  const loadCategories = async () => {
    try {
      const data = await api.categories.list()
      setCategories(data.items || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const applyFilters = async () => {
    const params = {}
    if (search) params.q = search
    if (category) params.category = category
    if (color) params.color = color
    if (weight) params.weight = weight
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice

    try {
      const data = await api.products.list(params)
      setProducts(data.items || [])
      setVisibleCount(8)
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const handleApply = () => {
    const params = {}
    if (search) params.q = search
    if (category) params.category = category
    if (color) params.color = color
    if (weight) params.weight = weight
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice

    setSearchParams(params)
  }

  const removeFilter = (key) => {
    const newParams = Object.fromEntries(searchParams)
    delete newParams[key]

    // Reset local state
    if (key === 'q') setSearch('')
    if (key === 'category') setCategory('')
    if (key === 'color') setColor('')
    if (key === 'weight') setWeight('')
    if (key === 'minPrice') setMinPrice('')
    if (key === 'maxPrice') setMaxPrice('')

    setSearchParams(newParams)
  }

  const handleAddToCart = async (productId, qty = 1) => {
    try {
      const product = products.find(p => p.id === productId)
      const variant = product?.colors?.[0] || ''

      await addToCart({ productId, variant, qty })
      showSuccess('Added to cart')

      // Update cart count
      const userData = await api.auth.me().catch(() => null)
      if (userData) {
        updateCartCount(userData.cartCount || 0)
      }
    } catch (error) {
      // Guest cart fallback
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]')
      const product = products.find(p => p.id === productId)
      const variant = product?.colors?.[0] || ''
      guestCart.push({ productId, variant, qty })
      localStorage.setItem('guestCart', JSON.stringify(guestCart))
      const count = guestCart.reduce((sum, i) => sum + i.qty, 0)
      updateCartCount(count)
      showSuccess('Added to cart (saved for login)')
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'newest') return (b.id || 0) - (a.id || 0)
    return 0
  })

  const visibleProducts = sortedProducts.slice(0, visibleCount)
  const activeFilters = Object.fromEntries(searchParams)

  return (
    <div className="container">
      <h1>Shop</h1>
      <div className="shop-layout">
        <aside className="filters">
          <details open>
            <summary>Search</summary>
            <div className="content">
              <input
                className="input"
                placeholder="Search yarns"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </details>

          <details open>
            <summary>Category</summary>
            <div className="content">
              <select
                className="input select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
          </details>

          <details open>
            <summary>Color</summary>
            <div className="content">
              <select
                className="input select"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              >
                <option value="">Any</option>
                <option>cream</option>
                <option>beige</option>
                <option>pastel-pink</option>
                <option>soft-blue</option>
                <option>gray</option>
                <option>white</option>
              </select>
            </div>
          </details>

          <details open>
            <summary>Weight</summary>
            <div className="content">
              <select
                className="input select"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              >
                <option value="">Any</option>
                <option>DK</option>
                <option>Worsted</option>
                <option>Aran</option>
              </select>
            </div>
          </details>

          <details open>
            <summary>Price</summary>
            <div className="content">
              <div className="row">
                <input
                  className="input"
                  type="number"
                  placeholder="Min $"
                  style={{ width: '110px' }}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  className="input"
                  type="number"
                  placeholder="Max $"
                  style={{ width: '110px' }}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </details>

          <button className="btn" onClick={handleApply}>Apply</button>
        </aside>

        <section>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="chips">
              {Object.entries(activeFilters).map(([key, value]) => (
                <span key={key} className="chip">
                  {key}: {value}{' '}
                  <button className="close" onClick={() => removeFilter(key)}>&times;</button>
                </span>
              ))}
            </div>
            <div>
              <label className="muted" htmlFor="sort">Sort</label>
              <select
                id="sort"
                className="input select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="popular">Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div className="grid" style={{ marginTop: '16px' }}>
            {visibleProducts.length === 0 ? (
              <div className="muted">No items match your filters.</div>
            ) : (
              visibleProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))
            )}
          </div>

          {visibleCount < sortedProducts.length && (
            <button
              className="btn"
              style={{ marginTop: '16px' }}
              onClick={() => setVisibleCount(prev => prev + 8)}
            >
              Load more
            </button>
          )}
        </section>
      </div>
    </div>
  )
}

function ProductCard({ product, onAddToCart }) {
  const [qty, setQty] = useState(1)

  return (
    <Link className="card wrap" to={`/product/${product.id}`}>
      <div className="ribbon">
        {product.stock < 10 ? 'Low stock' : 'Bestseller'}
      </div>
      <img
        src={product.images?.[0] || '/images/placeholder.svg'}
        alt={product.name}
      />
      <div className="pad">
        <div className="title">{product.name}</div>
        <div className="muted">{product.category?.replace(/^./, c => c.toUpperCase())}</div>
        <div className="price">${product.price.toFixed(2)}</div>
      </div>
      <div className="overlay">
        <div className="qty">
          <button onClick={(e) => { e.preventDefault(); setQty(Math.max(1, qty - 1)) }}>-</button>
          <input value={qty} readOnly />
          <button onClick={(e) => { e.preventDefault(); setQty(qty + 1) }}>+</button>
        </div>
        <button
          className="btn"
          onClick={(e) => {
            e.preventDefault()
            onAddToCart(product.id, qty)
          }}
        >
          Add
        </button>
      </div>
    </Link>
  )
}
