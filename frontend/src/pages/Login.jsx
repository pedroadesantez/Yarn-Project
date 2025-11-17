import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { error: showError } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Merge guest cart before login
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]')

      await login({ email, password })

      // If there was a guest cart, merge it
      if (guestCart.length > 0) {
        try {
          await fetch('/api/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: guestCart })
          })
          localStorage.removeItem('guestCart')
        } catch (err) {
          console.error('Error merging guest cart:', err)
        }
      }

      navigate('/shop')
    } catch (err) {
      showError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '420px' }}>
      <h1>Welcome back</h1>
      <form className="searchbar" style={{ flexDirection: 'column', gap: '12px' }} onSubmit={handleSubmit}>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <div className="muted" style={{ marginTop: '8px' }}>
        No account? <Link to="/register">Create one</Link>
      </div>
    </div>
  )
}
