import { useState } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import BudgetTracker from './components/BudgetTracker'
import FinancialTips from './components/FinancialTips'
import ErrorBoundary from './components/ErrorBoundary'
import AuthPanel from './components/AuthPanel'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState(() => {
    const email = window.localStorage.getItem('walleto_email')
    return email ? { email } : null
  })

  const handleAuth = (account) => {
    window.localStorage.setItem('walleto_token', account.token)
    window.localStorage.setItem('walleto_email', account.email)
    setUser({ email: account.email })
  }

  const logout = () => {
    window.localStorage.removeItem('walleto_token')
    window.localStorage.removeItem('walleto_email')
    setUser(null)
  }

  if (!user) return <AuthPanel onAuthenticated={handleAuth} />

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-block">
            <div className="logo">
              <span className="logo-icon">💸</span>
              <span className="logo-text">Walleto</span>
            </div>
            <span className="mini-badge">Finance + market insight</span>
          </div>
          <div className="account-block">
            <span className="tagline">Track spending. Watch trends. Grow smarter.</span>
            <button type="button" className="logout-btn" onClick={logout}>Sign out</button>
          </div>
        </div>
      </header>

      <nav className="nav-bar">
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-btn ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          Budget Tracker
        </button>
        <button
          className={`nav-btn ${activeTab === 'tips' ? 'active' : ''}`}
          onClick={() => setActiveTab('tips')}
        >
          Financial Tips
        </button>
      </nav>

      <main className="main-content">
        <ErrorBoundary>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'budget' && <BudgetTracker />}
          {activeTab === 'tips' && <FinancialTips />}
        </ErrorBoundary>
      </main>

      <footer className="app-footer">
        <p>Walleto 2026 | don’t waste your money</p>
      </footer>
    </div>
  )
}

export default App