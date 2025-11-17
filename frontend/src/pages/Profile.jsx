import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import api from '../utils/api'

export default function Profile() {
  const { user, isAuthenticated, refreshUser } = useAuth()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { success: showSuccess } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadProfile()
  }, [isAuthenticated, navigate])

  const loadProfile = async () => {
    try {
      const userData = await api.auth.me()
      setName(userData.name || '')
      setAddress(userData.profile?.address || '')
    } catch (error) {
      console.error('Error loading profile:', error)
      navigate('/login')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.auth.updateProfile({
        name,
        profile: { address },
        ...(password && { password })
      })

      showSuccess('Profile updated!')
      setPassword('')
      await refreshUser()
      await loadProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="container" style={{ maxWidth: '520px' }}>
      <h1>Your Profile</h1>
      <div className="card">
        <div className="pad">
          <div><strong>{user.name}</strong> — {user.email}</div>
          <div className="muted">
            Wishlist {user.wishlist?.length || 0} · Cart {user.cartCount || 0}
          </div>
        </div>
      </div>

      <h2>Update</h2>
      <form className="searchbar" style={{ flexDirection: 'column', gap: '12px' }} onSubmit={handleSave}>
        <input
          className="input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="Shipping address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="New password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  )
}
