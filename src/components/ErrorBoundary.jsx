import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error, info) {
    console.error('App error:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="setup">
          <div className="setup-card">
            <div className="logo">MINARVA<span>.</span></div>
            <h1>Something went wrong</h1>
            <p>The page hit an unexpected error. Please refresh to try again.</p>
            <button className="hero-btn" onClick={() => window.location.reload()}>Refresh</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
