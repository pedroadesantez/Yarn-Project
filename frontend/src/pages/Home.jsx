import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useToast } from '../hooks/useToast'
import api from '../utils/api'
import LoadingSkeleton from '../components/shared/LoadingSkeleton'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [bestsellers, setBestsellers] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { showToast } = useToast()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await api.products.list({})
      setFeatured(data.items.slice(0, 4))
      setBestsellers(data.items.slice(1, 5))
      setNewArrivals(data.items.slice(2, 6))
      setLoading(false)
    } catch (error) {
      console.error('Error loading products:', error)
      setLoading(false)
    }
  }

  const handleQuickAdd = async (product) => {
    try {
      await addToCart(product.id, 1)
      showToast(`${product.name} added to cart!`, 'success')
    } catch (error) {
      showToast('Failed to add to cart', 'error')
    }
  }

  return (
    <div style={{ background: 'var(--color-cream)' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-pastel-pink) 0%, var(--color-soft-blue) 100%)',
        padding: 'var(--space-20) 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-12)',
          alignItems: 'center'
        }}>
          <div style={{ zIndex: 1 }}>
            <div style={{
              display: 'inline-block',
              padding: 'var(--space-2) var(--space-4)',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-primary)',
              marginBottom: 'var(--space-6)',
              backdropFilter: 'blur(10px)'
            }}>
              ✨ Spring Collection 2025
            </div>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.1,
              color: 'var(--color-gray-900)',
              marginBottom: 'var(--space-6)'
            }}>
              Craft Your Dreams with
              <span style={{
                display: 'block',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Premium Yarns
              </span>
            </h1>

            <p style={{
              fontSize: 'var(--text-xl)',
              color: 'var(--color-gray-700)',
              marginBottom: 'var(--space-8)',
              lineHeight: 1.6,
              maxWidth: '600px'
            }}>
              From luxurious merino wool to sustainable cotton — discover hand-picked yarns in soft, warm tones that bring your creative visions to life.
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn-primary" style={{ fontSize: 'var(--text-lg)', padding: 'var(--space-4) var(--space-8)' }}>
                Shop Collection
              </Link>
              <Link to="/blog" className="btn-outline" style={{ fontSize: 'var(--text-lg)', padding: 'var(--space-4) var(--space-8)' }}>
                Free Patterns
              </Link>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: 'var(--radius-3xl)',
              padding: 'var(--space-8)',
              backdropFilter: 'blur(20px)',
              boxShadow: 'var(--shadow-2xl)',
              border: '1px solid rgba(255, 255, 255, 0.8)'
            }}>
              <img
                src="/images/hero-yarn.svg"
                alt="Premium yarn collection"
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius-2xl)',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{
        background: 'var(--color-white)',
        padding: 'var(--space-8) 0',
        borderBottom: '1px solid var(--color-gray-200)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-6)',
            textAlign: 'center'
          }}>
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: '🌱', title: 'Sustainable', desc: 'Eco-friendly yarns' },
              { icon: '⭐', title: '5-Star Rated', desc: '10,000+ happy crafters' },
              { icon: '🔒', title: 'Secure Payment', desc: '100% safe checkout' }
            ].map((badge, i) => (
              <div key={i}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>{badge.icon}</div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-gray-900)', marginBottom: 'var(--space-1)' }}>
                  {badge.title}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-cream)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-4xl)',
              color: 'var(--color-gray-900)',
              marginBottom: 'var(--space-3)'
            }}>
              Shop by Type
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-600)' }}>
              Find the perfect yarn for your next project
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {[
              { name: 'Merino Wool', slug: 'merino-wool', color: 'var(--color-pastel-pink)', desc: 'Luxuriously soft & warm' },
              { name: 'Cotton', slug: 'cotton', color: 'var(--color-soft-blue)', desc: 'Breathable & durable' },
              { name: 'Acrylic', slug: 'acrylic', color: 'var(--color-sage)', desc: 'Easy care & vibrant' },
              { name: 'Silk Blends', slug: 'silk', color: 'var(--color-lavender)', desc: 'Premium & elegant' }
            ].map(cat => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="card"
                style={{
                  background: cat.color,
                  padding: 'var(--space-8)',
                  textAlign: 'center',
                  transition: 'all var(--transition-base)',
                  border: 'none',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                }}
              >
                <h3 style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 700,
                  color: 'var(--color-gray-900)',
                  marginBottom: 'var(--space-2)'
                }}>
                  {cat.name}
                </h3>
                <p style={{ color: 'var(--color-gray-700)', fontSize: 'var(--text-sm)' }}>
                  {cat.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-white)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-8)'
          }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-4xl)',
                color: 'var(--color-gray-900)',
                marginBottom: 'var(--space-2)'
              }}>
                Featured Yarns
              </h2>
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-600)' }}>
                Hand-picked favorites from our collection
              </p>
            </div>
            <Link to="/shop" className="btn-outline">
              View All
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
              {[1, 2, 3, 4].map(i => <LoadingSkeleton key={i} type="card" />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
              {featured.map(product => (
                <div key={product.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1/1' }}>
                      <img
                        src={product.images?.[0] || '/images/placeholder.svg'}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform var(--transition-base)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      {product.badge && (
                        <span className="badge" style={{
                          position: 'absolute',
                          top: 'var(--space-3)',
                          left: 'var(--space-3)'
                        }}>
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div style={{ padding: 'var(--space-4)' }}>
                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{
                        fontSize: 'var(--text-lg)',
                        fontWeight: 600,
                        color: 'var(--color-gray-900)',
                        marginBottom: 'var(--space-2)'
                      }}>
                        {product.name}
                      </h3>
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: 'var(--text-xl)',
                        fontWeight: 700,
                        color: 'var(--color-primary)'
                      }}>
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="btn-outline btn-sm"
                      >
                        Quick Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bestsellers */}
      <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-cream)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-4xl)',
              color: 'var(--color-gray-900)',
              marginBottom: 'var(--space-3)'
            }}>
              Best Sellers
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-600)' }}>
              Our most loved yarns by crafters worldwide
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
              {[1, 2, 3, 4].map(i => <LoadingSkeleton key={i} type="card" />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
              {bestsellers.map(product => (
                <div key={product.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1/1' }}>
                      <img
                        src={product.images?.[0] || '/images/placeholder.svg'}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform var(--transition-base)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      <span className="badge badge-primary" style={{
                        position: 'absolute',
                        top: 'var(--space-3)',
                        left: 'var(--space-3)'
                      }}>
                        Bestseller
                      </span>
                    </div>
                  </Link>
                  <div style={{ padding: 'var(--space-4)' }}>
                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{
                        fontSize: 'var(--text-lg)',
                        fontWeight: 600,
                        color: 'var(--color-gray-900)',
                        marginBottom: 'var(--space-2)'
                      }}>
                        {product.name}
                      </h3>
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: 'var(--text-xl)',
                        fontWeight: 700,
                        color: 'var(--color-primary)'
                      }}>
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="btn-outline btn-sm"
                      >
                        Quick Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-4xl)',
              color: 'var(--color-gray-900)',
              marginBottom: 'var(--space-3)'
            }}>
              Loved by Crafters
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-600)' }}>
              See what our community has to say
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {[
              {
                name: 'Sarah M.',
                rating: 5,
                text: 'The merino wool is incredibly soft! Perfect stitch definition and the colors are even more beautiful in person.',
                project: 'Baby Blanket'
              },
              {
                name: 'Emma K.',
                rating: 5,
                text: 'Love the sustainable options. Fast shipping and the yarn quality is exceptional. My new favorite shop!',
                project: 'Cozy Cardigan'
              },
              {
                name: 'Lisa R.',
                rating: 5,
                text: 'Perfect for baby knits! The cotton is so gentle and breathable. Highly recommend for anyone crafting for little ones.',
                project: 'Baby Booties'
              },
              {
                name: 'Jessica T.',
                rating: 5,
                text: 'Beautiful website and even better yarn selection. Customer service is top-notch. Will definitely order again!',
                project: 'Throw Pillow'
              }
            ].map((testimonial, i) => (
              <div
                key={i}
                className="card"
                style={{
                  background: 'linear-gradient(135deg, var(--color-pastel-pink), var(--color-soft-blue))',
                  border: 'none'
                }}
              >
                <div style={{ display: 'flex', gap: 'var(--space-1)', marginBottom: 'var(--space-3)', fontSize: 'var(--text-lg)' }}>
                  {'⭐'.repeat(testimonial.rating)}
                </div>
                <p style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-gray-800)',
                  lineHeight: 1.6,
                  marginBottom: 'var(--space-4)',
                  fontStyle: 'italic'
                }}>
                  "{testimonial.text}"
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>
                      {testimonial.name}
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>
                      Project: {testimonial.project}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Crafting Inspiration */}
      <section style={{
        padding: 'var(--space-16) 0',
        background: 'linear-gradient(to bottom, var(--color-cream), var(--color-white))'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-4xl)',
              color: 'var(--color-gray-900)',
              marginBottom: 'var(--space-3)'
            }}>
              Get Inspired
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-600)', marginBottom: 'var(--space-6)' }}>
              Free patterns, tutorials, and crafting tips from our blog
            </p>
            <Link to="/blog" className="btn-primary">
              Explore Free Patterns
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-8)',
            marginTop: 'var(--space-12)'
          }}>
            {[
              { icon: '🧶', title: 'Beginner Guides', desc: 'Learn the basics with our step-by-step tutorials' },
              { icon: '📐', title: 'Free Patterns', desc: 'Download hundreds of patterns for all skill levels' },
              { icon: '💡', title: 'Expert Tips', desc: 'Pro techniques to elevate your crafting game' }
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: 'var(--space-4)'
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 700,
                  color: 'var(--color-gray-900)',
                  marginBottom: 'var(--space-2)'
                }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-base)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
