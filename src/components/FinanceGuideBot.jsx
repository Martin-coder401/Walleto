import { useEffect, useMemo, useRef, useState } from 'react'
import { fetchStockData } from '../api/financialApi'
import './styles/FinanceGuideBot.css'

const botName = 'Mira'
const allowedMessage = 'I focus on money, savings, and marketing guidance. Greetings always welcome. Ask about budgeting, saving, pricing, campaign ROI, or cash flow!'

const quickPrompts = [
  'What are the market prices today?',
  'Compare my savings with the market value.',
  'How should I save for an emergency fund?',
  'What marketing budget should I set for a launch?'
]

const greetingPhrases = ['hi', 'hello', 'hey', 'greetings', 'howdy', 'good morning', 'good afternoon', 'good evening', 'what\'s up']

const moneyKeywords = [
  'budget', 'save', 'savings', 'spend', 'money', 'cash', 'expense', 'income', 'price', 'market',
  'invest', 'bitcoin', 'ethereum', 'crypto', 'coin', 'stock', 'portfolio', 'marketing', 'campaign',
  'roi', 'revenue', 'cost', 'profit', 'financial', 'emergency', 'fund', 'goal', 'growth'
]

function getStoredBudgets() {
  try {
    const data = localStorage.getItem('walleto_budgets')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value)
}

function getUserFinancialStatus() {
  const budgets = getStoredBudgets()
  const totalBudget = budgets.reduce((sum, b) => sum + (Number(b.amount) || 0), 0)
  const totalSpent = budgets.reduce((sum, b) => sum + (Number(b.spent) || 0), 0)
  const totalSavings = budgets.reduce((sum, budget) => {
    const amount = Number(budget.amount) || 0
    const spent = Number(budget.spent) || 0
    return sum + Math.max(amount - spent, 0)
  }, 0)

  return { totalBudget, totalSpent, totalSavings, budgetCount: budgets.length }
}

function detectIntent(message) {
  const lower = message.toLowerCase().trim()
  if (!lower) return 'blocked'
  if (greetingPhrases.some((phrase) => lower.includes(phrase))) return 'greeting'
  if (moneyKeywords.some((keyword) => lower.includes(keyword))) return 'money'
  return 'blocked'
}

async function buildReply(message, financialStatus, marketData) {
  const intent = detectIntent(message)
  const lower = message.toLowerCase()

  if (intent === 'greeting') {
    const status = financialStatus.budgetCount > 0 ? ` I see you've got ${financialStatus.budgetCount} budget categories with ${formatCurrency(financialStatus.totalSavings)} in available savings.` : ''
    return `Hey! I'm ${botName}, your money guide. I help with budgeting, savings, cash flow, and marketing ROI.${status}`
  }

  if (intent === 'blocked') {
    return allowedMessage
  }

  const asksMarket = /(market|price|today|bitcoin|ethereum|stock|crypto|coin|value|cryptocurrency)/i.test(message)
  const asksComparison = /(compare|comparison|savings.*market|market.*savings|portfolio|worth|stack up)/i.test(message)

  if (asksMarket) {
    if (!marketData || !marketData.length) {
      return 'Market data is loading. Try again in a moment, or I can tell you about your current savings budget first.'
    }

    const topThree = marketData.slice(0, 3)
    const summary = topThree.map((item) => `${item.symbol}: ${formatCurrency(item.price)} (${item.changePercent >= 0 ? '📈' : '📉'} ${item.changePercent.toFixed(2)}%)`).join(' • ')

    return `Right now, the market is showing: ${summary}. With your available savings of ${formatCurrency(financialStatus.totalSavings)}, you could decide to keep that safe or allocate part of it to growth. What's your move?`
  }

  if (asksComparison) {
    if (!marketData || !marketData.length) {
      return 'Let me grab live market data for you... try again in a moment.'
    }

    if (financialStatus.budgetCount === 0) {
      return `You don't have any budgets saved yet. Start by creating a budget category in the app, and I'll compare your savings to market value.`
    }

    const marketValue = marketData.reduce((sum, item) => sum + item.price * 10, 0)
    const yourSavings = financialStatus.totalSavings

    if (yourSavings >= marketValue) {
      return `Nice: your available savings (${formatCurrency(yourSavings)}) are ahead of our market sample (${formatCurrency(marketValue)}). That's a solid buffer. Consider: are you ready to invest part of it, or does the safety feel right?`
    } else {
      return `Your available savings (${formatCurrency(yourSavings)}) are below our market sample (${formatCurrency(marketValue)}). That's okay — keep building. Focus on automating your savings goal, and it'll grow faster than you think.`
    }
  }

  if (lower.includes('marketing') || lower.includes('campaign') || lower.includes('ads') || lower.includes('brand') || lower.includes('roi')) {
    return `For marketing, think of it like this: spend only what you can track. Pick one channel, measure cost per lead and conversion rate weekly, and only scale what wins. Start small, prove the model, then double down.`
  }

  if (lower.includes('save') || lower.includes('savings') || lower.includes('emergency') || lower.includes('goal')) {
    return `Here's the trick: automate your savings on payday, before you spend. Set aside a fixed amount for emergencies (3–6 months of expenses), then grow other goals. It's less willpower, more habit.`
  }

  if (lower.includes('budget') || lower.includes('spend') || lower.includes('cash') || lower.includes('expense')) {
    const hasBudgets = financialStatus.budgetCount > 0
    const context = hasBudgets ? ` You're tracking ${financialStatus.budgetCount} categories with ${formatCurrency(financialStatus.totalSpent)} spent so far.` : ''
    return `A solid budget splits income into three buckets: essentials, goals, and buffer. Track weekly so you catch drift early.${context} What category should you focus on?`
  }

  if (lower.includes('invest') || lower.includes('portfolio') || lower.includes('growth')) {
    return `Investing works best when you have a clear time horizon and risk level. Start with a defined goal (like 'grow savings 10%'), then pick a vehicle (index funds, crypto, whatever fits). Review quarterly.`
  }

  return `I'm here to help with smart money moves. What's on your mind — budgeting, saving, marketing ROI, or cash flow?`
}

export default function FinanceGuideBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: `Hi! I'm ${botName}. I help with budgeting, savings, cash flow, and smart money decisions. What's on your mind?` }
  ])
  const [draft, setDraft] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [marketData, setMarketData] = useState(null)
  const [marketLoading, setMarketLoading] = useState(true)
  const shellRef = useRef(null)
  const chatThreadRef = useRef(null)

  const financialStatus = useMemo(() => getUserFinancialStatus(), [isOpen])

  useEffect(() => {
    if (chatThreadRef.current) {
      setTimeout(() => {
        chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight
      }, 0)
    }
  }, [messages, isLoading])

  useEffect(() => {
    async function loadMarketData() {
      setMarketLoading(true)
      const data = await fetchStockData()
      setMarketData(data)
      setMarketLoading(false)
    }

    loadMarketData()
    const interval = setInterval(loadMarketData, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shellRef.current && !shellRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!draft.trim()) return

    const userMessage = { id: Date.now(), sender: 'user', text: draft }
    setMessages([...messages, userMessage])
    setDraft('')
    setIsLoading(true)

    const reply = await buildReply(draft, financialStatus, marketData)
    const botMessage = { id: Date.now() + 1, sender: 'bot', text: reply }
    setMessages((prev) => [...prev, botMessage])
    setIsLoading(false)
  }

  const handleQuickPrompt = async (prompt) => {
    const userMessage = { id: Date.now(), sender: 'user', text: prompt }
    setMessages([...messages, userMessage])
    setIsLoading(true)

    const reply = await buildReply(prompt, financialStatus, marketData)
    const botMessage = { id: Date.now() + 1, sender: 'bot', text: reply }
    setMessages((prev) => [...prev, botMessage])
    setIsLoading(false)
  }

  const handleClearSession = () => {
    setMessages([
      { id: 1, sender: 'bot', text: `Hi! I'm ${botName}. I help with budgeting, savings, cash flow, and smart money decisions. What's on your mind?` }
    ])
    setDraft('')
  }

  return (
    <div className='finance-guide-shell' ref={shellRef}>
      {!isOpen && (
        <button className='guide-fab' onClick={() => setIsOpen(true)} title='Open Mira AI Finance Guide'>
          <span className='fab-icon'>✨</span>
          <span className='fab-label'>{botName} AI</span>
        </button>
      )}

      {isOpen && (
        <div className='guide-window'>
          <div className='guide-header'>
            <h3>{botName} Finance Guide</h3>
            <div className='guide-header-actions'>
              <button className='guide-clear' onClick={handleClearSession} title='Clear chat history'>🔄</button>
              <button className='guide-close' onClick={() => setIsOpen(false)}>✕</button>
            </div>
          </div>

          <div className='guide-container'>
            <div className='guide-main'>
              <div className='chat-thread' ref={chatThreadRef}>
                {messages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.sender}`}>
                    {msg.sender === 'bot' && <span className='bot-name'>{botName}:</span>}
                    <p>{msg.text}</p>
                  </div>
                ))}
                {isLoading && <div className='message bot'><p className='loading-text'>✨ Thinking...</p></div>}
              </div>

              {!draft && messages.length === 1 && (
                <div className='quick-prompts'>
                  {quickPrompts.map((prompt, idx) => (
                    <button key={idx} className='quick-btn' onClick={() => handleQuickPrompt(prompt)}>
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <div className='chat-form'>
                <input
                  type='text'
                  placeholder='Ask Mira...'
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading || !draft.trim()}>Send</button>
              </div>
            </div>

            <div className='market-summary'>
              <div className='summary-header'>
                <h4>Market Snapshot</h4>
                {marketLoading && <span className='loading-spinner'>⟳</span>}
              </div>

              {marketData && marketData.length > 0 ? (
                <>
                  <div className='market-cards'>
                    {marketData.slice(0, 3).map((coin) => (
                      <div key={coin.symbol} className='market-card'>
                        <div className='card-symbol'>{coin.symbol}</div>
                        <div className='card-price'>{formatCurrency(coin.price)}</div>
                        <div className={`card-change ${coin.changePercent >= 0 ? 'positive' : 'negative'}`}>
                          {coin.changePercent >= 0 ? '📈' : '📉'} {coin.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='summary-footer'>
                    <div className='footer-item'>
                      <span className='footer-label'>Your Savings</span>
                      <span className='footer-value'>{formatCurrency(financialStatus.totalSavings)}</span>
                    </div>
                    <div className='footer-item'>
                      <span className='footer-label'>Budgets</span>
                      <span className='footer-value'>{financialStatus.budgetCount}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className='market-loading'>
                  <p>Loading market data...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
