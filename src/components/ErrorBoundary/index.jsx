import React from 'react';

import styles from './index.scss';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      error: null
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    const { error, errorInfo } = this.state;
    if (errorInfo) {
      return (
        <div className={styles.error}>
          <h2>Something went wrong..</h2>
          <details open>
            <summary>{error && error.toString()}</summary>
            <pre>{error.stack || errorInfo.componentStack}</pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
