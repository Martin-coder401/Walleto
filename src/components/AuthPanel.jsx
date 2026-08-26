import { useState } from 'react'
import { apiRequest } from '../api/apiClient'

function AuthPanel({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const characterMood = error ? 'angry' : passwordFocused ? 'looking-away' : 'pointing'

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const account = await apiRequest(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(form) })
      onAuthenticated(account)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="logo"><span className="logo-icon">$</span><span className="logo-text">Walleto</span></div>
        <div className="auth-layout">
          <div className={`auth-character ${characterMood}`} aria-hidden="true">
            <div className="character-shadow" />
            <div className="character">
              <div className="briefcase"><span /></div>
              <div className="character-head"><i className="eye eye-left" /><i className="eye eye-right" /><i className="brow brow-left" /><i className="brow brow-right" /><span className="mouth" /></div>
              <div className="character-body"><span className="shirt-mark">$</span></div>
              <div className="arm arm-left" /><div className="arm arm-right" />
              <div className="leg leg-left" /><div className="leg leg-right" />
            </div>
            <span className="character-note">{error ? 'HEY!' : mode === 'login' ? 'THIS WAY' : 'YOU GOT THIS'}</span>
          </div>
          <div className="auth-form-content">
            <p className="eyebrow">Your money, in focus</p>
            <h1>{mode === 'login' ? 'Welcome back.' : 'Make a little room.'}</h1>
            <p className="auth-copy">Track budgets and everyday spending in one private workspace.</p>
            <form onSubmit={submit}>
              <label>Email<input type="email" value={form.email} onChange={(event) => { setForm({ ...form, email: event.target.value }); if (error) setError('') }} required /></label>
              <label>Password<input type="password" minLength="8" value={form.password} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
              {error && <p className="form-error">{error}</p>}
              <button className="primary-btn" disabled={loading}>{loading ? 'Working...' : mode === 'login' ? 'Log in' : 'Create account'}</button>
            </form>
            <button type="button" className="switch-btn" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setPasswordFocused(false) }}>
              {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AuthPanel