import React from 'react';

/**
 * Catches render-time errors anywhere in the tree so a single broken component
 * shows a friendly recovery screen instead of a blank white page.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          background: '#f5f5f5',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>😕</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 10, color: '#13191d' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#717171', marginBottom: 24 }}>
            An unexpected error occurred while loading this page. Please try again.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = '/';
            }}
            style={{
              background: '#76b0ab',
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              padding: '12px 28px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
}
