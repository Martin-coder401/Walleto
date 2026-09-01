import { useEffect, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { apiRequest } from '../api/apiClient'
import { fetchExchangeRates } from '../api/financialApi'
import './styles/BudgetTracker.css'

function BudgetTracker() {
  const [budgets, setBudgets] = useLocalStorage('walleto_budgets', [])
  const [transactions, setTransactions] = useState([])
  const [newCategory, setNewCategory] = useState({ category: '', amount: '' })
  const [newTransaction, setNewTransaction] = useState({ description: '', category: '', amount: '' })
  const [serverReady, setServerReady] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [editingBudgetId, setEditingBudgetId] = useState(null)
  const [editedSpent, setEditedSpent] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [exchangeRate, setExchangeRate] = useState(1)

  useEffect(() => {
    // Fetch user's budgets from server
    apiRequest('/budgets')
      .then((items) => { 
        setBudgets(items || [])
        setServerReady(true) 
      })
      .catch(() => {
        // If server fails, use empty list for authenticated users
        setBudgets([])
        setServerReady(false)
      })
  }, [setBudgets])

  useEffect(() => {
    // Fetch user's transactions from server
    apiRequest('/transactions')
      .then((items) => { 
        setTransactions(items || [])
      })
      .catch(() => {
        setTransactions([])
      })
  }, [])

  useEffect(() => {
    fetchExchangeRates().then((rates) => setExchangeRate(Number(rates.KES) || 1))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newCategory.category && newCategory.amount) {
      const draft = { category: newCategory.category, amount: parseFloat(newCategory.amount), spent: 0 }
      const save = serverReady ? apiRequest('/budgets', { method: 'POST', body: JSON.stringify(draft) }) : Promise.resolve({ ...draft, id: Date.now() })
      save.then((budget) => { setBudgets((current) => [...current, budget]); setNewCategory({ category: '', amount: '' }) })
    }
  }

  const startEditing = (budget) => {
    setEditingBudgetId(budget.id)
    setEditedSpent(String(budget.spent))
  }

  const cancelEditing = () => {
    setEditingBudgetId(null)
    setEditedSpent('')
  }

  const updateSpending = (id) => {
    const value = parseFloat(editedSpent) || 0
    setBudgets((current) => current.map((budget) => budget.id === id ? { ...budget, spent: value } : budget))
    if (serverReady) apiRequest(`/budgets/${id}`, { method: 'PATCH', body: JSON.stringify({ spent: value }) }).catch(() => {})
    cancelEditing()
  }

  const deleteCategory = (id) => {
    if (window.confirm('Delete this category?')) {
      setBudgets((current) => current.filter((budget) => budget.id !== id))
      if (serverReady) apiRequest(`/budgets/${id}`, { method: 'DELETE' }).catch(() => {})
    }
  }

  const handleAddTransaction = (e) => {
    e.preventDefault()
    if (newTransaction.description && newTransaction.category && newTransaction.amount) {
      const draft = { 
        description: newTransaction.description, 
        category: newTransaction.category, 
        amount: parseFloat(newTransaction.amount),
        occurred_on: new Date().toISOString().split('T')[0]
      }
      apiRequest('/transactions', { method: 'POST', body: JSON.stringify(draft) })
        .then((transaction) => {
          setTransactions((current) => [transaction, ...current])
          setNewTransaction({ description: '', category: '', amount: '' })
          setShowAddTransaction(false)
        })
        .catch((err) => console.error('Failed to add transaction:', err))
    }
  }

  const deleteTransaction = (id) => {
    if (window.confirm('Delete this transaction?')) {
      apiRequest(`/transactions/${id}`, { method: 'DELETE' })
        .then(() => {
          setTransactions((current) => current.filter((tx) => tx.id !== id))
        })
        .catch((err) => console.error('Failed to delete transaction:', err))
    }
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const remaining = totalBudget - totalSpent
  const usedPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
  const formatMoney = (amount) => `${currency === 'KES' ? 'KSh' : '$'}${(amount * (currency === 'KES' ? exchangeRate : 1)).toFixed(2)}`

  return (
    <div className="budget-tracker fade-in">
      <div className="tracker-header">
        <div>
          <h2>Budget Tracker</h2>
          <p className="subtitle">Track your spending by category</p>
        </div>
        <button
          type="button"
          className="currency-toggle-prominent"
          onClick={() => setCurrency((current) => current === 'USD' ? 'KES' : 'USD')}
          aria-label={`Switch currency to ${currency === 'USD' ? 'Kenyan shillings' : 'US dollars'}`}
          title={`Click to switch to ${currency === 'USD' ? 'KES (Kenyan Shillings)' : 'USD (US Dollars)'}`}
        >
          <span className="currency-icon">{currency === 'USD' ? '💵' : '🇰🇪'}</span>
          <span className="currency-text">{currency}</span>
        </button>
      </div>

      <div className="budget-summary">
        <div className="summary-card">
          <h4> Total Budget</h4>
          <p>{formatMoney(totalBudget)}</p>
        </div>
        <div className="summary-card">
          <h4> Total Spent</h4>
          <p>{formatMoney(totalSpent)}</p>
        </div>
        <div className="summary-card">
          <h4> Amount remaining </h4>
          <p className={remaining < 0 ? 'negative' : ''}>{formatMoney(remaining)}</p>
        </div>
        <div className="summary-card">
          <h4> Money Used</h4>
          <p>{usedPercentage.toFixed(0)}%</p>
        </div>
      </div>

      <div className="budget-list">
        <div className="budget-header">
          <span>Category</span>
          <span>Spent / Budget</span>
          <span>Progress</span>
          <span></span>
        </div>
        {budgets.map((budget) => {
          const progress = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0
          const isOver = budget.spent > budget.amount
          return (
            <div key={budget.id} className="budget-item">
              <span className="category-name">{budget.category}</span>
              <div className="budget-amounts">
                {editingBudgetId === budget.id ? (
                  <input
                    type="number"
                    className="spent-input"
                    value={editedSpent}
                    onChange={(e) => setEditedSpent(e.target.value)}
                    min="0"
                    step="1"
                    aria-label={`Spent for ${budget.category}`}
                  />
                ) : (
                  <span className="spent-value">{formatMoney(Number(budget.spent))}</span>
                )}
                <span className="separator">/</span>
                <span className="amount">{formatMoney(Number(budget.amount))}</span>
              </div>
              <div className="progress-wrapper">
                <div className="progress-bar">
                  <div className={`progress-fill ${isOver ? 'over' : ''}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}></div>
                </div>
                <span className="progress-text">{Math.min(progress, 100).toFixed(0)}%</span>
              </div>
              <div className="budget-actions">
                {editingBudgetId === budget.id ? (
                  <>
                    <button type="button" className="update-btn" onClick={() => updateSpending(budget.id)}>Save Update</button>
                    <button type="button" className="cancel-btn" onClick={cancelEditing}>Cancel</button>
                  </>
                ) : (
                  <button type="button" className="update-btn" onClick={() => startEditing(budget)}>Update</button>
                )}
                <button type="button" className="delete-btn" onClick={() => deleteCategory(budget.id)}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="add-budget-section">
        <button
          type="button"
          className="add-category-toggle"
          onClick={() => setShowAddForm((current) => !current)}
        >
          {showAddForm ? 'Hide New Category' : 'Add New Category'}
        </button>
        {showAddForm && (
          <form onSubmit={handleSubmit} className="budget-form">
            <input
              type="text"
              placeholder="Category name"
              value={newCategory.category}
              onChange={(e) => setNewCategory({ ...newCategory, category: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Budget amount"
              value={newCategory.amount}
              onChange={(e) => setNewCategory({ ...newCategory, amount: e.target.value })}
              required
              min="0"
              step="1"
            />
            <button type="submit">Add Category</button>
          </form>
        )}
      </div>

    </div>
  )
}

export default BudgetTracker