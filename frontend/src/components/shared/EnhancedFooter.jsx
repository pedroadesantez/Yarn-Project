import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { useToast } from '../../hooks/useToast'

export default function EnhancedFooter() {
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const { showToast } = useToast()

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setSubscribing(true)
    try {
      // In a real app, you'd call an API endpoint here
      // await api.newsletter.subscribe({ email })
      showToast('Thank you for subscribing to our newsletter!', 'success')
      setEmail('')
    } catch (error) {
      showToast('Failed to subscribe. Please try again.', 'error')
    } finally {
      setSubscribing(false)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer style={{
      background: 'linear-gradient(to bottom, var(--color-white), var(--color-cream))',
      borderTop: '1px solid var(--color-gray-200)',
      marginTop: 'auto'
    }}>
      {/* Newsletter Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-pastel-pink), var(--color-soft-blue))',
        padding: 'var(--space-12) 0'
      }}>
        <div className="container" style={{
          maxWidth: '800px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-3xl)',
            color: 'var(--color-gray-900)',
            marginBottom: 'var(--space-3)'
          }}>
            Join Our Crafting Community
          </h3>
          <p style={{
            color: 'var(--color-gray-700)',
            marginBottom: 'var(--space-6)',
            fontSize: 'var(--text-lg)'
          }}>
            Get exclusive patterns, tips, and early access to new yarn collections
          </p>

          <form onSubmit={handleNewsletterSubmit} style={{
            display: 'flex',
            gap: 'var(--space-3)',
            maxWidth: '500px',
            margin: '0 auto',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              style={{
                flex: '1 1 300px',
                borderRadius: 'var(--radius-full)',
                padding: 'var(--space-3) var(--space-5)',
                border: 'none',
                fontSize: 'var(--text-base)'
              }}
            />
            <button
              type="submit"
              disabled={subscribing}
              className="btn-primary"
              style={{
                borderRadius: 'var(--radius-full)',
                padding: 'var(--space-3) var(--space-6)',
                whiteSpace: 'nowrap'
              }}
            >
              {subscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container" style={{
        padding: 'var(--space-12) var(--space-4)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-8)'
        }}>
          {/* About Section */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-2xl)',
              color: 'var(--color-gray-900)',
              marginBottom: 'var(--space-4)'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-pastel-pink))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                🧶 Yarnly
              </span>
            </h4>
            <p style={{
              color: 'var(--color-gray-600)',
              lineHeight: '1.6',
              marginBottom: 'var(--space-4)'
            }}>
              Premium yarns for passionate crafters. From luxurious merino to sustainable cotton, we bring you the finest materials for your creative projects.
            </p>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              {[
                { name: 'Instagram', icon: '📷' },
                { name: 'Pinterest', icon: '📌' },
                { name: 'Facebook', icon: '👥' },
                { name: 'YouTube', icon: '▶️' }
              ].map(social => (
                <a
                  key={social.name}
                  href={`#${social.name.toLowerCase()}`}
                  title={social.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-gray-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-lg)',
                    transition: 'all var(--transition-fast)',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-primary)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--color-gray-100)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: 'var(--color-gray-900)',
              marginBottom: 'var(--space-4)'
            }}>
              Shop
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[
                { to: '/shop', label: 'All Products' },
                { to: '/shop?category=merino-wool', label: 'Merino Wool' },
                { to: '/shop?category=cotton', label: 'Cotton Yarns' },
                { to: '/shop?category=acrylic', label: 'Acrylic Yarns' },
                { to: '/shop?category=silk', label: 'Silk Blends' },
                { to: '/shop?new=true', label: 'New Arrivals' },
                { to: '/shop?sale=true', label: 'Sale Items' }
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={{
                      color: 'var(--color-gray-600)',
                      textDecoration: 'none',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray-600)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: 'var(--color-gray-900)',
              marginBottom: 'var(--space-4)'
            }}>
              Customer Service
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[
                { to: '/contact', label: 'Contact Us' },
                { to: '/faq', label: 'FAQ' },
                { to: '/shipping', label: 'Shipping & Returns' },
                { to: '/size-guide', label: 'Yarn Weight Guide' },
                { to: '/care', label: 'Care Instructions' },
                { to: '/orders', label: 'Track Order' },
                { to: '/gift-cards', label: 'Gift Cards' }
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={{
                      color: 'var(--color-gray-600)',
                      textDecoration: 'none',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray-600)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Resources */}
          <div>
            <h4 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: 'var(--color-gray-900)',
              marginBottom: 'var(--space-4)'
            }}>
              About & Resources
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[
                { to: '/about', label: 'About Us' },
                { to: '/blog', label: 'Blog & Patterns' },
                { to: '/sustainability', label: 'Sustainability' },
                { to: '/wholesale', label: 'Wholesale' },
                { to: '/affiliates', label: 'Affiliate Program' },
                { to: '/careers', label: 'Careers' },
                { to: '/press', label: 'Press Kit' }
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={{
                      color: 'var(--color-gray-600)',
                      textDecoration: 'none',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray-600)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div style={{
          borderTop: '1px solid var(--color-gray-200)',
          borderBottom: '1px solid var(--color-gray-200)',
          padding: 'var(--space-6) 0',
          marginBottom: 'var(--space-6)'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-6)',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {[
              { icon: '🔒', text: 'Secure Checkout' },
              { icon: '🚚', text: 'Free Shipping $50+' },
              { icon: '↩️', text: 'Easy Returns' },
              { icon: '🌱', text: 'Eco-Friendly' },
              { icon: '⭐', text: '5-Star Rated' },
              { icon: '📦', text: 'Fast Shipping' }
            ].map((badge, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: 'var(--color-gray-700)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500
                }}
              >
                <span style={{ fontSize: 'var(--text-xl)' }}>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods & Copyright */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {/* Payment Icons */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['💳 Visa', '💳 Mastercard', '💳 Amex', '💳 PayPal', '💳 Apple Pay', '💳 Google Pay'].map(method => (
              <span
                key={method}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: 'var(--color-gray-100)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-gray-600)'
                }}
              >
                {method}
              </span>
            ))}
          </div>

          {/* Copyright */}
          <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)' }}>
            © {currentYear} Yarnly. All rights reserved.
          </p>

          {/* Legal Links */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { to: '/privacy', label: 'Privacy Policy' },
              { to: '/terms', label: 'Terms of Service' },
              { to: '/cookies', label: 'Cookie Policy' },
              { to: '/accessibility', label: 'Accessibility' }
            ].map((link, i) => (
              <span key={link.to}>
                {i > 0 && <span style={{ color: 'var(--color-gray-400)', margin: '0 var(--space-2)' }}>•</span>}
                <Link
                  to={link.to}
                  style={{
                    color: 'var(--color-gray-600)',
                    fontSize: 'var(--text-sm)',
                    textDecoration: 'none',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray-600)'}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
