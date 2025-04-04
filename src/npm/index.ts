import { h, render } from 'preact';
import * as React from 'react';
import { ChatboxWidget } from '../components/ChatboxWidget.js';

// Import global CSS
import '../global.css';

// Named exports for utilities and types
export * from '../core/types.js';

// Create a React-compatible props interface
export interface FleekChatboxProps {
  agentId: string;
  pat: string;
  colors?: Record<string, string>;
}

/**
 * FleekChatbox component that renders the ChatboxWidget directly in place
 */
class FleekChatbox extends React.Component<FleekChatboxProps> {
  private containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: FleekChatboxProps) {
    super(props);
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    this.applyStyles();
    this.renderPreactComponent();
  }

  componentDidUpdate() {
    this.applyStyles();
    this.renderPreactComponent();
  }

  componentWillUnmount() {
    if (this.containerRef.current) {
      render(null, this.containerRef.current);
    }
  }

  applyStyles() {
    const { colors } = this.props;

    if (this.containerRef.current) {
      // Apply CSS variables from :root to the container
      const rootStyles = getComputedStyle(document.documentElement);
      for (let i = 0; i < rootStyles.length; i++) {
        const variable = rootStyles[i];
        if (variable.startsWith('--')) {
          const value = rootStyles.getPropertyValue(variable);
          this.containerRef.current.style.setProperty(variable, value);
        }
      }

      // Apply color overrides if provided
      if (colors && Object.keys(colors).length > 0) {
        for (const [key, value] of Object.entries(colors)) {
          this.containerRef.current.style.setProperty(`--${key}`, value);
        }
      }
    }
  }

  renderPreactComponent() {
    const { agentId, pat, colors } = this.props;

    if (this.containerRef.current) {
      // Render the Preact component into the container
      render(
        h(ChatboxWidget, { agentId, pat, colors, useFixedPosition: false }),
        this.containerRef.current,
      );
    }
  }

  render() {
    // Create a container div that will be used to render the Preact component
    return React.createElement('div', { ref: this.containerRef });
  }
}

// Default export
export default FleekChatbox;
