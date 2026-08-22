import React from 'react'
import './styles/FinancialTips.css'

function FinancialTips() {
  const tips = [
    {
      id: 1,
      title: 'The 50/30/20 Rule',
      description: 'Spend 50% on needs, 30% on wants, and save 20% of your income.',
      category: 'Budgeting',
      icon: ''
    },
    {
      id: 2,
      title: 'Build an Emergency Fund',
      description: 'Save 3-6 months of expenses for unexpected situations.',
      category: 'Savings',
      icon: ''
    },
    {
      id: 3,
      title: 'Track Your Spending',
      description: 'Use apps to track where your money goes each month.',
      category: 'Tracking',
      icon: ''
    },
    {
      id: 4,
      title: 'Pay Yourself First',
      description: 'Automate savings before spending on non-essentials.',
      category: 'Savings',
      icon: ''
    },
    {
      id: 5,
      title: 'Use Credit Cards Wisely',
      description: 'Pay full balance monthly to avoid interest and build credit.',
      category: 'Credit',
      icon: ''
    },
    {
      id: 6,
      title: 'Invest in Index Funds',
      description: 'Low-cost index funds offer diversified market exposure.',
      category: 'Investing',
      icon: ''
    },
  ]

  return (
    <div className="financial-tips fade-in">
      <h2> Financial Tips</h2>
      <p className="subtitle">Learn smart money management</p>

      <div className="tips-grid">
        {tips.map((tip) => (
          <div key={tip.id} className="tip-card">
            <div className="tip-icon">{tip.icon}</div>
            <div className="tip-content">
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
              <span className="tip-category">{tip.category}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="tips-quote">
        <blockquote>
          "Financial freedom is available to those who learn about it and work for it."
          <cite>— Robert Kiyosaki</cite>
        </blockquote>
      </div>
    </div>
  )
}

export default FinancialTips