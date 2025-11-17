import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={index}>
          {index > 0 && <span className="breadcrumbs-separator">›</span>}
          {item.href ? (
            <Link to={item.href}>{item.label}</Link>
          ) : (
            <span style={{ color: 'var(--color-gray-900)' }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
