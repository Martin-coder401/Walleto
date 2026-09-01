import { useEffect, useState } from 'react'
import './styles/FinancialTips.css'

function FinancialTips() {
  const [todaysTipIndex, setTodaysTipIndex] = useState(0)
  const [todaysQuoteIndex, setTodaysQuoteIndex] = useState(0)

  const allTips = [
    {
      id: 1,
      title: 'The 50/30/20 Rule',
      description: 'Allocate 50% to needs, 30% to wants, and save 20% of your income for a balanced budget.',
      category: 'Budgeting',
      icon: '📊'
    },
    {
      id: 2,
      title: 'Build an Emergency Fund',
      description: 'Save 3-6 months of living expenses in an accessible account for unexpected situations.',
      category: 'Savings',
      icon: '🛡️'
    },
    {
      id: 3,
      title: 'Track Your Spending',
      description: 'Monitor where your money goes daily. Small expenses add up—visibility is power.',
      category: 'Tracking',
      icon: '📈'
    },
    {
      id: 4,
      title: 'Automate Your Savings',
      description: 'Set up automatic transfers on payday to save before you spend. Make it a habit.',
      category: 'Savings',
      icon: '🤖'
    },
    {
      id: 5,
      title: 'Pay Off Debt Strategically',
      description: 'Focus on high-interest debt first. Use the snowball or avalanche method for faster payoff.',
      category: 'Debt',
      icon: '💳'
    },
    {
      id: 6,
      title: 'Invest Early & Often',
      description: 'Time in the market beats timing the market. Start investing early, even with small amounts.',
      category: 'Investing',
      icon: '📡'
    },
    {
      id: 7,
      title: 'Negotiate Your Income',
      description: 'Ask for raises, negotiate job offers, and pursue higher-paying opportunities annually.',
      category: 'Income',
      icon: '💼'
    },
    {
      id: 8,
      title: 'Diversify Your Income',
      description: 'Create multiple income streams through side hustles, investments, or passive income.',
      category: 'Income',
      icon: '🌳'
    },
    {
      id: 9,
      title: 'Use the 30-Day Rule',
      description: 'Wait 30 days before buying non-essentials. Most impulse wants fade away.',
      category: 'Spending',
      icon: '⏰'
    },
    {
      id: 10,
      title: 'Review Subscriptions Monthly',
      description: 'Cancel unused subscriptions. Audit all recurring charges to free up cash flow.',
      category: 'Spending',
      icon: '🔍'
    },
    {
      id: 11,
      title: 'Understand Compound Interest',
      description: 'Small investments grow exponentially over time. Start early to maximize compound returns.',
      category: 'Investing',
      icon: '✨'
    },
    {
      id: 12,
      title: 'Live Below Your Means',
      description: 'Spend less than you earn consistently. The gap between income and expenses is wealth.',
      category: 'Budgeting',
      icon: '🎯'
    },
    {
      id: 13,
      title: 'Build Your Credit Score',
      description: 'Pay bills on time, keep credit utilization low, and maintain a healthy credit history.',
      category: 'Credit',
      icon: '⭐'
    },
    {
      id: 14,
      title: 'Create a Financial Goal',
      description: 'Define clear, measurable goals. Whether saving $10K or paying off debt—write it down.',
      category: 'Planning',
      icon: '🎪'
    },
    {
      id: 15,
      title: 'Tax-Optimize Your Life',
      description: 'Use tax-advantaged accounts (401k, IRA, HSA) to reduce tax burden and grow wealth faster.',
      category: 'Taxes',
      icon: '📋'
    }
  ]

  const allQuotes = [
    { text: 'Financial freedom is available to those who learn about it and work for it.', author: 'Robert Kiyosaki' },
    { text: 'The best investment is in the tools of one\'s own trade.', author: 'Benjamin Franklin' },
    { text: 'Money moves from those who don\'t understand it, to those who do.', author: 'Josh Waitzkin' },
    { text: 'Wealth is not about having great income. It\'s about spending less than you make.', author: 'Naval Ravikant' },
    { text: 'Do not save what is left after spending; instead spend what is left after saving.', author: 'Warren Buffett' },
    { text: 'The stock market is a device for transferring money from the impatient to the patient.', author: 'Warren Buffett' },
    { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
    { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
    { text: 'Don\'t tell me where your priorities are. Show me where you spend your money, and I\'ll tell you what they are.', author: 'James W. Frick' },
    { text: 'Price is what you pay. Value is what you get.', author: 'Warren Buffett' },
    { text: 'It\'s not how much money you make, but how much money you keep.', author: 'Robert Kiyosaki' },
    { text: 'The man who does not read has no advantage over the man who cannot read.', author: 'Mark Twain' },
    { text: 'Your life does not get better by chance, it gets better by change.', author: 'Jim Rohn' },
    { text: 'The secret to wealth is simple: find a way to do more for others than anyone else does.', author: 'Tony Robbins' },
    { text: 'Money is a terrible master but an excellent servant.', author: 'P.T. Barnum' }
  ]

  useEffect(() => {
    const today = new Date().toDateString()
    const lastDate = localStorage.getItem('walleto_tips_date')
    
    if (lastDate !== today) {
      const newTipIndex = Math.floor(Math.random() * allTips.length)
      const newQuoteIndex = Math.floor(Math.random() * allQuotes.length)
      
      localStorage.setItem('walleto_tips_date', today)
      localStorage.setItem('walleto_tip_index', newTipIndex.toString())
      localStorage.setItem('walleto_quote_index', newQuoteIndex.toString())
      
      setTodaysTipIndex(newTipIndex)
      setTodaysQuoteIndex(newQuoteIndex)
    } else {
      const savedTipIndex = localStorage.getItem('walleto_tip_index')
      const savedQuoteIndex = localStorage.getItem('walleto_quote_index')
      
      setTodaysTipIndex(parseInt(savedTipIndex || '0'))
      setTodaysQuoteIndex(parseInt(savedQuoteIndex || '0'))
    }
  }, [])

  const todaysTip = allTips[todaysTipIndex]
  const todaysQuote = allQuotes[todaysQuoteIndex]

  return (
    <div className="financial-tips fade-in">
      <div className="tips-header">
        <div>
          <h2>💡 Today's Money Wisdom</h2>
          <p className="subtitle">Fresh insights every day to grow your wealth</p>
        </div>
      </div>

      {todaysTip && (
        <div className="featured-tip">
          <div className="featured-tip-inner">
            <div className="featured-tip-icon">{todaysTip.icon}</div>
            <div className="featured-tip-content">
              <span className="featured-tip-label">Daily Tip</span>
              <h3>{todaysTip.title}</h3>
              <p>{todaysTip.description}</p>
              <div className="featured-tip-category">
                <span className="category-badge">{todaysTip.category}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="tips-section">
        <h3 className="section-title">Browse All Tips</h3>
        <div className="tips-grid">
          {allTips.map((tip) => (
            <div key={tip.id} className={`tip-card ${tip.id === todaysTip?.id ? 'highlighted' : ''}`}>
              <div className="tip-icon">{tip.icon}</div>
              <div className="tip-content">
                <h4>{tip.title}</h4>
                <p>{tip.description}</p>
                <span className="tip-category">{tip.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {todaysQuote && (
        <div className="tips-quote">
          <svg className="quote-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.4-5-7-5s-6 3.75-6 5c0 2.5.75 4.5 1.5 5.5S4 12 8 14c.5.5 1 1 1 2 0 1-.5 2-1.5 2s-2-.5-2-2-1-3-3-4M15 21c3 0 7-1 7-8V5c0-1.25-4.4-5-7-5s-6 3.75-6 5c0 2.5.75 4.5 1.5 5.5S14 12 18 14c.5.5 1 1 1 2 0 1-.5 2-1.5 2s-2-.5-2-2-1-3-3-4" />
          </svg>
          <blockquote>
            "{todaysQuote.text}"
            <cite>— {todaysQuote.author}</cite>
          </blockquote>
        </div>
      )}
    </div>
  )
}

export default FinancialTips
