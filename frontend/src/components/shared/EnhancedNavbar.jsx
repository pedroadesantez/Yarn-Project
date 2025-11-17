import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import SearchBar from './SearchBar'
import api from '../../utils/api'

export default function EnhancedNavbar({ onCartClick }) {
  const { user, isAuthenticated, cartCount, logout } = useAuth()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false)
  const [categories, setCategories] = useState([])
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadCategories()

    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const loadCategories = async () => {
    try {
      const data = await api.categories.list()
      setCategories(data.items || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleLogout = async (e) => {
    e.preventDefault()
    await logout()
    navigate('/')
  }

  return (
    <header
      className={`modern-navbar ${scrolled ? 'scrolled' : ''}`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
        background: scrolled ? 'rgba(250, 247, 245, 0.95)' : 'var(--color-cream)',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: '1px solid var(--color-gray-200)',
        transition: 'all var(--transition-base)',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none'
      }}
    >
      {/* Top Announcement Bar */}
      <div style={{
        background: 'linear-gradient(90deg, var(--color-pastel-pink), var(--color-soft-blue))',
        color: 'var(--color-gray-800)',
        textAlign: 'center',
        padding: 'var(--space-2)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500
      }}>
        ✨ Free Shipping on Orders Over $50 | New Spring Collection Available
      </div>

      {/* Main Navbar */}
      <div className="container">
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-6)',
          padding: 'var(--space-4) 0',
        }}>
          {/* Logo */}
          <Link
            to="/"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--color-gray-900)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}
          >
            <span style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-pastel-pink))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              🧶 Yarnly
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-6)',
            flex: 1,
          }} className="hide-mobile">
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setShowCategoriesMenu(true)}
              onMouseLeave={() => setShowCategoriesMenu(false)}
            >
              <Link
                to="/shop"
                style={{
                  color: 'var(--color-gray-700)',
                  fontWeight: 500,
                  fontSize: 'var(--text-base)',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-fast)',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-gray-100)'
                  e.currentTarget.style.color = 'var(--color-gray-900)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--color-gray-700)'
                }}
              >
                Shop ▾
              </Link>

              {/* Mega Menu */}
              {showCategoriesMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: 'var(--space-2)',
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-xl)',
                  padding: 'var(--space-6)',
                  minWidth: '300px',
                  border: '1px solid var(--color-gray-200)',
                  zIndex: 'var(--z-dropdown)'
                }}>
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', textTransform: 'uppercase', color: 'var(--color-gray-500)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>Categories</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {categories.map(cat => (
                        <Link
                          key={cat.id}
                          to={`/shop?category=${cat.slug}`}
                          style={{
                            padding: 'var(--space-2) var(--space-3)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-gray-700)',
                            transition: 'all var(--transition-fast)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--color-gray-100)'
                            e.currentTarget.style.color = 'var(--color-primary)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.color = 'var(--color-gray-700)'
                          }}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-gray-200)' }}>
                    <Link to="/shop" className="btn-outline btn-sm btn-block">
                      View All Products
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/blog" style={{ color: 'var(--color-gray-700)', fontWeight: 500 }}>Blog</Link>
            <Link to="/about" style={{ color: 'var(--color-gray-700)', fontWeight: 500 }}>About</Link>
            <Link to="/contact" style={{ color: 'var(--color-gray-700)', fontWeight: 500 }}>Contact</Link>
          </div>

          {/* Search Bar */}
          <div style={{ flex: 1, maxWidth: '400px', position: 'relative' }} className="hide-mobile">
            <SearchBar placeholder="Search premium yarns..." />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {isAuthenticated ? (
              <>
                <Link to="/wishlist" style={{ color: 'var(--color-gray-700)', fontSize: 'var(--text-xl)' }} title="Wishlist">
                  ♥
                </Link>
                <Link to="/profile" style={{ color: 'var(--color-gray-700)', fontWeight: 500 }}>
                  {user?.name?.split(' ')[0] || 'Account'}
                </Link>
                <button onClick={handleLogout} className="btn-ghost btn-sm">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="btn-outline btn-sm">
                Sign In
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              style={{
                position: 'relative',
                padding: 'var(--space-2) var(--space-4)',
                background: 'var(--color-primary)',
                color: 'var(--color-white)',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 'var(--text-sm)',
                transition: 'all var(--transition-base)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-primary-dark)'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-primary)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              🛒 Cart {cartCount > 0 && `(${cartCount})`}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="show-mobile"
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 'var(--text-2xl)',
                cursor: 'pointer',
                padding: 'var(--space-2)',
                color: 'var(--color-gray-700)'
              }}
            >
              ☰
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      {mobileNavOpen && (
        <div style={{
          background: 'var(--color-white)',
          borderTop: '1px solid var(--color-gray-200)',
          padding: 'var(--space-4)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <SearchBar />
            <Link to="/shop" onClick={() => setMobileNavOpen(false)}>Shop</Link>
            <Link to="/blog" onClick={() => setMobileNavOpen(false)}>Blog</Link>
            <Link to="/about" onClick={() => setMobileNavOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setMobileNavOpen(false)}>Contact</Link>
            {isAuthenticated && (
              <>
                <Link to="/wishlist" onClick={() => setMobileNavOpen(false)}>Wishlist</Link>
                <Link to="/orders" onClick={() => setMobileNavOpen(false)}>Orders</Link>
                <Link to="/profile" onClick={() => setMobileNavOpen(false)}>Profile</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile {
            display: none !important;
          }
          .show-mobile {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .show-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  )
}
