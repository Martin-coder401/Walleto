import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          color: '#fff',
        }}>
          <h2>⚠️ Something went wrong</h2>
          <p style={{ margin: '20px 0' }}>{this.state.error?.message}</p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
              border: 'none',
              borderRadius: '50px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            🔄 Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary