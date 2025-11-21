import { Component } from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorInfo: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ZenRo boundary caught:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <style>
            {`
              .error-fallback {
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #f8f9fa;
                color: #1f1f1f;
                text-align: center;
                padding: 2rem;
                gap: 1.5rem;
              }
              .error-fallback h1 {
                font-size: 3rem;
                margin: 0;
              }
              .error-fallback p {
                max-width: 420px;
                color: #555;
                line-height: 1.6;
              }
              .error-fallback button {
                padding: 0.75rem 2.5rem;
                border: none;
                border-radius: 999px;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                background: #111;
                color: #fff;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
              }
              .error-fallback button:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 24px rgba(0,0,0,0.18);
              }
            `}
          </style>

          <h1>😔 Oops!</h1>
          <h2>Something went wrong on our end.</h2>
          <p>
            We’ve logged the error and will take a look. Please refresh the page to
            get back to browsing ZenRo fits.
          </p>
          <button type="button" onClick={this.handleReload}>
            Refresh page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
