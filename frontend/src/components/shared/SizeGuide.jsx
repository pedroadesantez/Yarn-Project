import Modal from './Modal'

export default function SizeGuide({ isOpen, onClose }) {
  const yarnWeights = [
    {
      category: '0 - Lace',
      weight: 'Fingering',
      gauge: '32-42 sts',
      needleSize: '1.5-2.25mm',
      projects: 'Delicate lace shawls, doilies'
    },
    {
      category: '1 - Super Fine',
      weight: 'Sock/Fingering',
      gauge: '27-32 sts',
      needleSize: '2.25-3.5mm',
      projects: 'Socks, baby items, fine lacework'
    },
    {
      category: '2 - Fine',
      weight: 'Sport/Baby',
      gauge: '23-26 sts',
      needleSize: '3.5-4.5mm',
      projects: 'Baby garments, lightweight sweaters'
    },
    {
      category: '3 - Light',
      weight: 'DK/Light Worsted',
      gauge: '21-24 sts',
      needleSize: '4.5-5.5mm',
      projects: 'Lightweight garments, blankets'
    },
    {
      category: '4 - Medium',
      weight: 'Worsted/Aran',
      gauge: '16-20 sts',
      needleSize: '5.5-6.5mm',
      projects: 'Sweaters, afghans, mittens'
    },
    {
      category: '5 - Bulky',
      weight: 'Chunky/Craft',
      gauge: '12-15 sts',
      needleSize: '6.5-9mm',
      projects: 'Quick projects, rugs, heavy blankets'
    },
    {
      category: '6 - Super Bulky',
      weight: 'Super Chunky',
      gauge: '7-11 sts',
      needleSize: '9-12mm',
      projects: 'Quick blankets, scarves, hats'
    },
    {
      category: '7 - Jumbo',
      weight: 'Jumbo',
      gauge: '6 sts or fewer',
      needleSize: '12mm+',
      projects: 'Ultra-quick projects, statement pieces'
    }
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yarn Weight Guide">
      <div style={{ overflowX: 'auto' }}>
        <p style={{
          marginBottom: 'var(--space-6)',
          color: 'var(--color-gray-700)',
          lineHeight: 1.6
        }}>
          Understanding yarn weight is essential for choosing the right yarn for your project. The weight refers to the thickness of the yarn strand and affects gauge, drape, and recommended needle size.
        </p>

        <div style={{
          display: 'grid',
          gap: 'var(--space-4)'
        }}>
          {yarnWeights.map((weight, index) => (
            <div
              key={index}
              style={{
                background: index % 2 === 0 ? 'var(--color-cream)' : 'var(--color-white)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-gray-200)'
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 'var(--space-3)'
              }}>
                <div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-gray-600)',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginBottom: 'var(--space-1)'
                  }}>
                    Category
                  </div>
                  <div style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 700,
                    color: 'var(--color-primary)'
                  }}>
                    {weight.category}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-gray-700)'
                  }}>
                    {weight.weight}
                  </div>
                </div>

                <div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-gray-600)',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginBottom: 'var(--space-1)'
                  }}>
                    Gauge (4" / 10cm)
                  </div>
                  <div style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-gray-900)',
                    fontWeight: 600
                  }}>
                    {weight.gauge}
                  </div>
                </div>

                <div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-gray-600)',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginBottom: 'var(--space-1)'
                  }}>
                    Needle Size
                  </div>
                  <div style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-gray-900)',
                    fontWeight: 600
                  }}>
                    {weight.needleSize}
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-gray-600)',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginBottom: 'var(--space-1)'
                  }}>
                    Typical Projects
                  </div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-gray-700)'
                  }}>
                    {weight.projects}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 'var(--space-6)',
          padding: 'var(--space-4)',
          background: 'var(--color-soft-blue)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-gray-200)'
        }}>
          <h4 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: 'var(--color-gray-900)',
            marginBottom: 'var(--space-2)'
          }}>
            💡 Pro Tip
          </h4>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-gray-700)',
            lineHeight: 1.6
          }}>
            Always check the label on your yarn for specific gauge and needle recommendations. Different fiber types at the same weight category may knit up differently. When in doubt, knit a gauge swatch!
          </p>
        </div>
      </div>
    </Modal>
  )
}
