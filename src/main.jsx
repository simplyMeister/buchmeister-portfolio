import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 40, 
          color: '#e11d48', 
          background: '#fff', 
          fontFamily: 'monospace',
          border: '2px solid #e11d48',
          margin: 20,
          borderRadius: 8
        }}>
          <h1 style={{ marginBottom: 16 }}>Runtime Error Detected</h1>
          <p style={{ marginBottom: 8, fontWeight: 'bold' }}>{this.state.error?.message}</p>
          <pre style={{ 
            fontSize: 12, 
            background: '#f8fafc', 
            padding: 16, 
            overflow: 'auto',
            maxHeight: '60vh'
          }}>
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: 20,
              padding: '8px 16px',
              background: '#e11d48',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
