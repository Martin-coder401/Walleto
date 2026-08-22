import React from 'react'
import './styles/LoadingSpinner.css'

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner