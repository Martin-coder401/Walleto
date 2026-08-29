import { useState } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import BudgetTracker from './components/BudgetTracker'
import FinancialTips from './components/FinancialTips'
import ErrorBoundary from './components/ErrorBoundary'
import AuthPanel from './components/AuthPanel'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const handleLogout = () => {
    window.localStorage.removeItem('walleto_token')
    setAuthenticated(false)
    setUser(null)
  }

  if (!authenticated) {
    return <AuthPanel onAuthenticated={(account) => {
      setUser(account)
      setAuthenticated(true)
    }} />
  }

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
            {user && <span className="user-email">{user.email}</span>}
            <button className="logout-btn" onClick={handleLogout}>Log out</button>
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