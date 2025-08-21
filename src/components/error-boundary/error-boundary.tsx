import { Component } from 'preact';
import './error-boundary.css';

export interface ErrorBoundaryState {
  error: Error | string | null | any;
}

export class ErrorBoundary extends Component<unknown, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: any) {
    return { error: error };
  }

  private _getErrorName(): string {
    const error = this.state.error;
    if (!error) return '';

    if (typeof error === 'string') return 'Error';

    let name = 'Error';
    if ('cause' in error && error.cause.name) {
      name = error.cause.name;
    }
    if ('name' in error && error.name) {
      name = error.name;
    }
    return name;
  }

  private _getErrorMessage(): string {
    const error = this.state.error;
    if (!error) return '';

    if (typeof error === 'string') return error;

    if ('cause' in error) {
      const message = error.cause.shortMessage || error.cause.message || error.cause.details;
      if (message) {
        return message;
      }
    }
    return error.message || 'Unknown error';
  }

  private _getErrorTrace(): string | undefined {
    if (this.state.error instanceof Error) {
      return this.state.error.stack;
    }
  }

  private _reset() {
    this.setState({ error: null });
    (window?.location as any)?.reload(true);
  }

  componentDidCatch(error: any) {
    this.setState({ error: error });
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    const errorName = this._getErrorName();
    const errorMessage = this._getErrorMessage();
    const errorStack = this._getErrorTrace();

    return (
      <main className="error-boundary">
        <div className="banner">
          <img src="/images/500-static.svg" alt="Internal Site Error" />
          <div className="caption">
            <span>Internal Site Error</span>
          </div>
        </div>

        {errorName ? <h1 className="error-name">{errorName}</h1> : null}

        {errorMessage ? <div className="error-message">{errorMessage}</div> : null}

        {errorStack ? <div className="error-stack monospace">{errorStack}</div> : null}

        <hr />

        <button type="button" className="btn" onClick={() => this._reset()}>
          Reset and try again
        </button>
      </main>
    );
  }
}
