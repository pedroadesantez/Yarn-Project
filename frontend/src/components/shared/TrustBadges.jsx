export default function TrustBadges({ variant = 'default', layout = 'horizontal' }) {
  const badges = {
    default: [
      { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
      { icon: '🌱', title: 'Sustainable', desc: 'Eco-friendly yarns' },
      { icon: '⭐', title: '5-Star Rated', desc: '10,000+ happy crafters' },
      { icon: '🔒', title: 'Secure Payment', desc: '100% safe checkout' }
    ],
    compact: [
      { icon: '🚚', title: 'Free Shipping $50+' },
      { icon: '↩️', title: 'Easy Returns' },
      { icon: '🌱', title: 'Eco-Friendly' },
      { icon: '⭐', title: '5-Star Rated' }
    ],
    product: [
      { icon: '✓', title: 'Quality Guaranteed', desc: 'Premium materials' },
      { icon: '🚚', title: 'Fast Shipping', desc: '2-5 business days' },
      { icon: '↩️', title: '30-Day Returns', desc: 'Hassle-free returns' },
      { icon: '🔒', title: 'Secure Checkout', desc: 'SSL encrypted' }
    ],
    footer: [
      { icon: '🔒', text: 'Secure Checkout' },
      { icon: '🚚', text: 'Free Shipping $50+' },
      { icon: '↩️', text: 'Easy Returns' },
      { icon: '🌱', text: 'Eco-Friendly' },
      { icon: '⭐', text: '5-Star Rated' },
      { icon: '📦', text: 'Fast Shipping' }
    ]
  }

  const selectedBadges = badges[variant] || badges.default

  // Footer variant uses different structure
  if (variant === 'footer') {
    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-6)',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {selectedBadges.map((badge, i) => (
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
    )
  }

  // Compact variant (no descriptions)
  if (variant === 'compact') {
    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
        justifyContent: 'center'
      }}>
        {selectedBadges.map((badge, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-4)',
              background: 'var(--color-cream)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--color-gray-700)',
              border: '1px solid var(--color-gray-200)'
            }}
          >
            <span style={{ fontSize: 'var(--text-base)' }}>{badge.icon}</span>
            <span>{badge.title}</span>
          </div>
        ))}
      </div>
    )
  }

  // Default and product variants (with descriptions)
  const gridColumns = layout === 'horizontal'
    ? 'repeat(auto-fit, minmax(200px, 1fr))'
    : '1fr'

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: gridColumns,
      gap: 'var(--space-6)',
      textAlign: layout === 'horizontal' ? 'center' : 'left'
    }}>
      {selectedBadges.map((badge, i) => (
        <div key={i}>
          <div style={{
            fontSize: layout === 'horizontal' ? '3rem' : '2rem',
            marginBottom: 'var(--space-2)'
          }}>
            {badge.icon}
          </div>
          <h3 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: 'var(--color-gray-900)',
            marginBottom: 'var(--space-1)'
          }}>
            {badge.title}
          </h3>
          {badge.desc && (
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-600)',
              margin: 0
            }}>
              {badge.desc}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
