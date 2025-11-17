import Modal from './Modal'

export default function CareInstructions({ isOpen, onClose, fiberType = 'general' }) {
  const careGuides = {
    wool: {
      name: 'Wool & Wool Blends',
      icon: '🐑',
      washing: 'Hand wash in cool water with wool-safe detergent',
      drying: 'Lay flat to dry, reshape while damp',
      ironing: 'Steam gently if needed, never direct heat',
      storage: 'Store clean and dry with moth protection',
      tips: [
        'Never wring or twist wool - gently squeeze out excess water',
        'Avoid hot water which can cause felting',
        'Use a salad spinner to remove excess water gently',
        'Block items to desired measurements while damp'
      ]
    },
    cotton: {
      name: 'Cotton & Cotton Blends',
      icon: '🌱',
      washing: 'Machine wash cold or hand wash',
      drying: 'Lay flat or tumble dry low',
      ironing: 'Iron on medium heat while slightly damp',
      storage: 'Store clean and folded in a cool, dry place',
      tips: [
        'Cotton can shrink - always check label before washing',
        'May stretch when wet - handle carefully',
        'Benefits from blocking to even out stitches',
        'Colors may fade - wash darks separately'
      ]
    },
    acrylic: {
      name: 'Acrylic & Synthetic',
      icon: '✨',
      washing: 'Machine wash warm, gentle cycle',
      drying: 'Tumble dry low or lay flat',
      ironing: 'Use low heat if necessary - can melt',
      storage: 'Store folded in any dry location',
      tips: [
        'Easy care and durable for everyday items',
        'Won\'t felt but can pill with wear',
        'Heat can permanently damage acrylic',
        'Great for items that need frequent washing'
      ]
    },
    silk: {
      name: 'Silk & Luxury Fibers',
      icon: '✨',
      washing: 'Hand wash gently in cool water',
      drying: 'Roll in towel, then lay flat to dry',
      ironing: 'Iron on silk setting while slightly damp',
      storage: 'Store clean, away from direct sunlight',
      tips: [
        'Use specialized silk or delicate detergent',
        'Never bleach or use harsh chemicals',
        'Keep away from prolonged sunlight to prevent fading',
        'Handle gently when wet as fibers are delicate'
      ]
    },
    general: {
      name: 'General Yarn Care',
      icon: '🧶',
      washing: 'Check yarn label for specific instructions',
      drying: 'Lay flat to dry when possible',
      ironing: 'Test on swatch first, use appropriate heat',
      storage: 'Store clean, dry, and protected from pests',
      tips: [
        'Always read and follow the care label on your yarn',
        'Test wash a swatch before washing full project',
        'Use mesh laundry bags for machine washing',
        'Store finished items clean to prevent moth damage'
      ]
    }
  }

  const guide = careGuides[fiberType] || careGuides.general

  const careSymbols = [
    { symbol: '🌊', label: 'Washing', desc: guide.washing },
    { symbol: '💨', label: 'Drying', desc: guide.drying },
    { symbol: '🔥', label: 'Ironing', desc: guide.ironing },
    { symbol: '📦', label: 'Storage', desc: guide.storage }
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Care Instructions">
      <div>
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-6)',
          background: 'linear-gradient(135deg, var(--color-pastel-pink), var(--color-soft-blue))',
          borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--space-6)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-3)' }}>
            {guide.icon}
          </div>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-2xl)',
            color: 'var(--color-gray-900)',
            marginBottom: 'var(--space-2)'
          }}>
            {guide.name}
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)'
        }}>
          {careSymbols.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                padding: 'var(--space-4)',
                background: 'var(--color-cream)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-gray-200)'
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                flexShrink: 0,
                width: '50px',
                textAlign: 'center'
              }}>
                {item.symbol}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                  color: 'var(--color-gray-900)',
                  textTransform: 'uppercase',
                  marginBottom: 'var(--space-1)'
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-gray-700)',
                  lineHeight: 1.6
                }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: 'var(--color-white)',
          border: '2px solid var(--color-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)'
        }}>
          <h4 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: 'var(--color-gray-900)',
            marginBottom: 'var(--space-3)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            💡 Expert Tips
          </h4>
          <ul style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            margin: 0,
            padding: 0
          }}>
            {guide.tips.map((tip, index) => (
              <li
                key={index}
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-gray-700)',
                  lineHeight: 1.6,
                  paddingLeft: 'var(--space-4)',
                  position: 'relative'
                }}
              >
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: 'var(--color-primary)',
                  fontWeight: 700
                }}>
                  •
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div style={{
          marginTop: 'var(--space-6)',
          padding: 'var(--space-4)',
          background: 'var(--color-soft-blue)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-gray-700)',
            lineHeight: 1.6,
            margin: 0
          }}>
            <strong>Important:</strong> These are general guidelines. Always check the specific care instructions on your yarn label and test on a swatch before washing your finished project.
          </p>
        </div>
      </div>
    </Modal>
  )
}
