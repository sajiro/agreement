/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from "react"
// import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js";
// import { SeverityLevel } from "@microsoft/applicationinsights-web";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  
  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo
    })
    // You can also log error messages to an error reporting service here
    // const appInsights = useAppInsightsContext();
    // appInsights.trackException( { error: new Error(error),  severityLevel: SeverityLevel.Error, ErrorMessage: errorInfo.componentStack});
  }
  
  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }  
  }

  export default ErrorBoundary