import React, { useState } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import BudgetTracker from './components/BudgetTracker'
import FinancialTips from './components/FinancialTips'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon"></span>
            <span className="logo-text">Walleto</span>
            
          </div>
          <div className="tagline">Genz manage your money </div>
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
        <p>Walleto 2026 | don't waste your money  </p>
      </footer>
    </div>
  )
}

export default App