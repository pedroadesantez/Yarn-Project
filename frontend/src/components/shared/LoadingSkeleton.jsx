export default function LoadingSkeleton({ type = 'text', count = 1, height, width, className = '' }) {
  const skeletons = Array.from({ length: count }, (_, i) => i)

  if (type === 'card') {
    return (
      <div className={`card ${className}`}>
        <div className="skeleton" style={{ height: '200px', marginBottom: '1rem' }} />
        <div style={{ padding: '1rem' }}>
          <div className="skeleton skeleton-text" style={{ width: '60%' }} />
          <div className="skeleton skeleton-text" style={{ width: '40%' }} />
        </div>
      </div>
    )
  }

  if (type === 'circle') {
    return (
      <div
        className={`skeleton skeleton-circle ${className}`}
        style={{ width: width || '48px', height: height || '48px' }}
      />
    )
  }

  return (
    <>
      {skeletons.map(i => (
        <div
          key={i}
          className={`skeleton skeleton-text ${className}`}
          style={{ width: width || '100%', height: height || '1em' }}
        />
      ))}
    </>
  )
}
