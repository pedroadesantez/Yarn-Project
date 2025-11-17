import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar({ onCartClick }) {
  const { user, isAuthenticated, cartCount, logout } = useAuth()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async (e) => {
    e.preventDefault()
    await logout()
    navigate('/')
  }

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen)
  }

  const closeMobileNav = () => {
    setMobileNavOpen(false)
  }

  const handleCartClick = (e) => {
    e.preventDefault()
    if (onCartClick) {
      onCartClick()
    }
  }

  return (
    <header>
      <div className="container nav">
        <div className="row">
          <div className="hamburger" id="hamburger" onClick={toggleMobileNav}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <Link className="brand" to="/">Yarnly</Link>
        </div>
        <nav className="links hide-mobile">
          <Link to="/shop">Shop</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/about">About</Link>
          <Link to="/faq">FAQs</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="actions">
          <span id="account-link">
            {isAuthenticated ? (
              <>
                <Link to="/profile">My Account</Link> ·{' '}
                <a href="#" onClick={handleLogout}>Logout</a>
              </>
            ) : (
              <Link to="/login">Sign In</Link>
            )}
          </span>
          <a className="btn-ghost btn-icon" href="/cart" onClick={handleCartClick}>
            Cart <span id="cart-count">{cartCount > 0 ? `(${cartCount})` : ''}</span>
          </a>
        </div>
      </div>
      <div id="mobile-nav" className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`}>
        <Link to="/shop" onClick={closeMobileNav}>Shop</Link>
        <Link to="/blog" onClick={closeMobileNav}>Blog</Link>
        <Link to="/about" onClick={closeMobileNav}>About</Link>
        <Link to="/faq" onClick={closeMobileNav}>FAQs</Link>
        <Link to="/contact" onClick={closeMobileNav}>Contact</Link>
      </div>
    </header>
  )
}
