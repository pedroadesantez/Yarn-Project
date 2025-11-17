import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

export default function Auth() {
  const [activeTab, setActiveTab] = useState('signin')
  const [signinForm, setSigninForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)

  const { login, register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(signinForm)
      showToast('Welcome back!', 'success')
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (error) {
      showToast(error.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()

    if (signupForm.password !== signupForm.confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }

    setLoading(true)
    try {
      await register({
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password
      })
      showToast('Account created successfully!', 'success')
      navigate('/')
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-8) var(--space-4)',
      background: 'linear-gradient(135deg, var(--color-cream) 0%, var(--color-soft-blue) 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-2xl)',
        boxShadow: 'var(--shadow-2xl)',
        overflow: 'hidden'
      }}>
        {/* Tab Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderBottom: '2px solid var(--color-gray-200)'
        }}>
          <button
            onClick={() => setActiveTab('signin')}
            style={{
              padding: 'var(--space-4)',
              background: activeTab === 'signin' ? 'var(--color-white)' : 'var(--color-gray-100)',
              border: 'none',
              borderBottom: activeTab === 'signin' ? '3px solid var(--color-primary)' : '3px solid transparent',
              fontWeight: 700,
              fontSize: 'var(--text-lg)',
              color: activeTab === 'signin' ? 'var(--color-primary)' : 'var(--color-gray-600)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              fontFamily: 'var(--font-heading)'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            style={{
              padding: 'var(--space-4)',
              background: activeTab === 'signup' ? 'var(--color-white)' : 'var(--color-gray-100)',
              border: 'none',
              borderBottom: activeTab === 'signup' ? '3px solid var(--color-primary)' : '3px solid transparent',
              fontWeight: 700,
              fontSize: 'var(--text-lg)',
              color: activeTab === 'signup' ? 'var(--color-primary)' : 'var(--color-gray-600)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              fontFamily: 'var(--font-heading)'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: 'var(--space-8)' }}>
          {activeTab === 'signin' ? (
            // Sign In Form
            <div>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-3xl)',
                  color: 'var(--color-gray-900)',
                  marginBottom: 'var(--space-2)'
                }}>
                  Welcome Back
                </h2>
                <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-base)' }}>
                  Sign in to your account to continue
                </p>
              </div>

              <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 600,
                    color: 'var(--color-gray-700)',
                    fontSize: 'var(--text-sm)'
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={signinForm.email}
                    onChange={(e) => setSigninForm({ ...signinForm, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 600,
                    color: 'var(--color-gray-700)',
                    fontSize: 'var(--text-sm)'
                  }}>
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={signinForm.password}
                    onChange={(e) => setSigninForm({ ...signinForm, password: e.target.value })}
                    required
                  />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 'var(--text-sm)'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                    <input type="checkbox" />
                    <span style={{ color: 'var(--color-gray-600)' }}>Remember me</span>
                  </label>
                  <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary btn-block"
                  style={{
                    padding: 'var(--space-3)',
                    fontSize: 'var(--text-lg)',
                    marginTop: 'var(--space-2)'
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            </div>
          ) : (
            // Sign Up Form
            <div>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-3xl)',
                  color: 'var(--color-gray-900)',
                  marginBottom: 'var(--space-2)'
                }}>
                  Create Account
                </h2>
                <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-base)' }}>
                  Join our community of crafters
                </p>
              </div>

              <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 600,
                    color: 'var(--color-gray-700)',
                    fontSize: 'var(--text-sm)'
                  }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Jane Doe"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 600,
                    color: 'var(--color-gray-700)',
                    fontSize: 'var(--text-sm)'
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 600,
                    color: 'var(--color-gray-700)',
                    fontSize: 'var(--text-sm)'
                  }}>
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontWeight: 600,
                    color: 'var(--color-gray-700)',
                    fontSize: 'var(--text-sm)'
                  }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <div style={{ fontSize: 'var(--text-sm)' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', cursor: 'pointer' }}>
                    <input type="checkbox" required style={{ marginTop: '2px' }} />
                    <span style={{ color: 'var(--color-gray-600)' }}>
                      I agree to the{' '}
                      <a href="/terms" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary btn-block"
                  style={{
                    padding: 'var(--space-3)',
                    fontSize: 'var(--text-lg)',
                    marginTop: 'var(--space-2)'
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>
          )}

          {/* Social Login */}
          <div style={{ marginTop: 'var(--space-6)' }}>
            <div style={{
              position: 'relative',
              textAlign: 'center',
              marginBottom: 'var(--space-4)'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '1px',
                background: 'var(--color-gray-200)'
              }} />
              <span style={{
                position: 'relative',
                background: 'var(--color-white)',
                padding: '0 var(--space-4)',
                color: 'var(--color-gray-600)',
                fontSize: 'var(--text-sm)'
              }}>
                Or continue with
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <button
                type="button"
                className="btn-outline"
                style={{ padding: 'var(--space-3)' }}
              >
                <span style={{ marginRight: 'var(--space-2)' }}>🔷</span>
                Google
              </button>
              <button
                type="button"
                className="btn-outline"
                style={{ padding: 'var(--space-3)' }}
              >
                <span style={{ marginRight: 'var(--space-2)' }}>👥</span>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
