import { useEffect, useState } from 'react'
import { apiRequest } from '../api/apiClient'

function AuthPanel({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [formFocused, setFormFocused] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('walleto_remember_me')

    if (stored) {
      try {
        const { email } = JSON.parse(stored)

        if (email) {
          setForm((currentForm) => ({
            ...currentForm,
            email,
          }))

          setRememberMe(true)
        }
      } catch {
        localStorage.removeItem('walleto_remember_me')
      }
    }
  }, [])

  const characterMood = error
    ? 'angry'
    : passwordFocused
      ? 'looking-away'
      : formFocused
        ? 'excited'
        : 'pointing'

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const account = await apiRequest(`/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify(form),
      })

      // Save the JWT token returned by the backend.
      // apiClient.js will use this token for protected requests.
      if (account?.token) {
        localStorage.setItem('walleto_token', account.token)
      }

      // Remember only the email.
      // Never store the user's password in localStorage.
      if (rememberMe) {
        localStorage.setItem(
          'walleto_remember_me',
          JSON.stringify({
            email: form.email,
          }),
        )
      } else {
        localStorage.removeItem('walleto_remember_me')
      }

      onAuthenticated(account)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setPasswordFocused(false)
    setForm({ email: '', password: '' })
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="logo logo-animated">
          <span className="logo-icon">💰</span>
          <span className="logo-text">Walleto</span>
        </div>

        <div className="auth-layout">
          <div className={`auth-character ${characterMood}`} aria-hidden="true">
            <div className="character-shadow" />

            <div className="character">
              <div className="briefcase">
                <span />
              </div>

              <div className="character-head">
                <i className="eye eye-left" />
                <i className="eye eye-right" />
                <i className="brow brow-left" />
                <i className="brow brow-right" />
                <span className="mouth" />
              </div>

              <div className="character-body">
                <span className="shirt-mark">$</span>
              </div>

              <div className="arm arm-left" />
              <div className="arm arm-right" />
              <div className="leg leg-left" />
              <div className="leg leg-right" />
            </div>

            <span className="character-note">
              {error
                ? 'HEY!'
                : mode === 'login'
                  ? 'THIS WAY'
                  : 'YOU GOT THIS'}
            </span>
          </div>

          <div className="auth-form-content">
            <p className="eyebrow">Your money, in focus</p>

            <h1 className="form-title">
              {mode === 'login'
                ? 'Welcome back.'
                : 'Make a little room.'}
            </h1>

            <p className="auth-copy">
              Track budgets and everyday spending in one private workspace.
            </p>

            <form
              onSubmit={submit}
              onFocus={() => setFormFocused(true)}
              onBlur={() => setFormFocused(false)}
              className="auth-form"
            >
              <div className="input-group">
                <label>Email</label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => {
                    setForm({
                      ...form,
                      email: event.target.value,
                    })

                    if (error) {
                      setError('')
                    }
                  }}
                  required
                  className="auth-input"
                />
              </div>

              <div className="input-group">
                <label>Password</label>

                <input
                  type="password"
                  minLength="8"
                  value={form.password}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      password: event.target.value,
                    })
                  }
                  required
                  className="auth-input"
                />
              </div>

              <div className="remember-me-group">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                  className="remember-checkbox"
                />

                <label
                  htmlFor="remember-me"
                  className="remember-label"
                >
                  Remember me
                </label>
              </div>

              {error && (
                <p className="form-error error-animate">
                  {error}
                </p>
              )}

              <button
                className="primary-btn btn-animate"
                disabled={loading}
              >
                <span className="btn-text">
                  {loading
                    ? 'Working...'
                    : mode === 'login'
                      ? 'Log in'
                      : 'Create account'}
                </span>
              </button>
            </form>

            <button
              type="button"
              className="switch-btn"
              onClick={toggleMode}
            >
              {mode === 'login'
                ? 'New here? Create an account'
                : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AuthPanel