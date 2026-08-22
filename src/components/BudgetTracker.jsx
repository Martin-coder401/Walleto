import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import './styles/BudgetTracker.css'

function BudgetTracker() {
  const [budgets, setBudgets] = useLocalStorage('walleto_budgets', [
    { id: 1, category: 'Rent', amount: 900, spent: 900 },
    { id: 2, category: 'Groceries', amount: 400, spent: 320 },
    { id: 3, category: 'Transport', amount: 300, spent: 250 },
    { id: 4, category: 'Entertainment', amount: 350, spent: 280 },
    { id: 5, category: 'Savings', amount: 450, spent: 450 },
  ])

  const [newCategory, setNewCategory] = useState({ category: '', amount: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newCategory.category && newCategory.amount) {
      setBudgets([...budgets, {
        id: Date.now(),
        category: newCategory.category,
        amount: parseFloat(newCategory.amount),
        spent: 0,
      }])
      setNewCategory({ category: '', amount: '' })
    }
  }

  const updateSpending = (id, spent) => {
    setBudgets(budgets.map((budget) =>
      budget.id === id ? { ...budget, spent: parseFloat(spent) || 0 } : budget
    ))
  }

  const deleteCategory = (id) => {
    if (window.confirm('Delete this category?')) {
      setBudgets(budgets.filter((budget) => budget.id !== id))
    }
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const remaining = totalBudget - totalSpent
  const usedPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  return (
    <div className="budget-tracker fade-in">
      <h2> Budget Tracker</h2>
      <p className="subtitle">Track your spending by category</p>

      <div className="budget-summary">
        <div className="summary-card">
          <h4> Total Budget</h4>
          <p>${totalBudget.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h4> Total Spent</h4>
          <p>${totalSpent.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h4> Amount remaining </h4>
          <p className={remaining < 0 ? 'negative' : ''}>${remaining.toFixed(2)}</p>
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
                <input
                  type="number"
                  className="spent-input"
                  value={budget.spent}
                  onChange={(e) => updateSpending(budget.id, e.target.value)}
                  min="0"
                  step="1"
                />
                <span className="separator">/</span>
                <span className="amount">${budget.amount}</span>
              </div>
              <div className="progress-wrapper">
                <div className="progress-bar">
                  <div className={`progress-fill ${isOver ? 'over' : ''}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}></div>
                </div>
                <span className="progress-text">{Math.min(progress, 100).toFixed(0)}%</span>
              </div>
              <button className="delete-btn" onClick={() => deleteCategory(budget.id)}>✕</button>
            </div>
          )
        })}
      </div>

      <div className="add-budget-section">
        <h3>➕ Add New Category</h3>
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
      </div>
    </div>
  )
}

export default BudgetTracker